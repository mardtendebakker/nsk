import {
  HttpException, Injectable, Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  catchError, delay, delayWhen, lastValueFrom, of, retry,
} from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { Order } from './dto/find-order-response.dto';
import { ProductRelation } from '../stock/types/product-relation';
import { FileService } from '../file/file.service';
import { AttributeType } from '../attribute/enum/attribute-type.enum';
import { FILE_VALUE_DELIMITER } from '../stock/types/file-value-delimiter.const';
import { MagentoCustomeAttrs } from './types/magento-custom-attrs';
import { hasValue } from '../common/util/has-value';
import { MagentoAttrOption } from './types/magento-attr-option';
import { ProductAttributeIncludeAttribute } from '../stock/types/product-attribute-include-attribute';
import { MagentoAttrInput } from './enum/magento-attr-input.enum';
import { MagentoAttrScope } from './enum/magento-attr-scope.enum';
import { MagentoEntityTypeId } from './enum/magento-entity-type-id.enum';
import { MagentoAttr } from './types/magento-attr';
import { AttributeService } from '../attribute/attribute.service';
import { MagentoAttrGroupCode, MagentoAttrGroupName } from './enum/magento-attr-group.enum';
import { MagentoAttrSetId } from './enum/magento-attr-set-id.enum';
import { MagentoAttrSet } from './types/magento-attr-set';
import { ProductTypeService } from '../admin/product-type/product-type.service';

@Injectable()
export class WebshopService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
    private readonly productTypeService: ProductTypeService,
    private readonly attributeService: AttributeService,
  ) {}

  async fetchOrderById(orderId: string): Promise<Order | null> {
    const response = await lastValueFrom(
      this.httpService.get(
        `${this.configService.get<string>('MAGENTO_BASE_URL')}rest/V1/nexxus/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${this.configService.get<string>('MAGENTO_API_KEY')}` } },
      ).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(`${error?.config?.url}->${error?.message}`, error?.response?.status);
        }),
      ),
    );

    const { data } = response;

    if (!data?.id) {
      return null;
    }

    const address = data.shipping_address;

    return Object.assign(new Order(), {
      id: orderId,
      customer: {
        city: address.city,
        country: address.country,
        email: address.email,
        name: `${address.firstname} ${address.lastname}`,
        phone: address.telephone,
        street: address.street,
        zipcode: address.postcode,
      },
      transport: data.shipping_amount,
      products: data.items,
    });
  }

  async addProduct(product: ProductRelation, availableQuantity: number): Promise<void> {
    try {
      const entries2d = await this.getAllEntries(product);
      const entries = [].concat(...entries2d);

      const uploadedProduct = await this.uploadProduct(product, availableQuantity);

      try {
        const medias = await this.getProductMedias(uploadedProduct.data.sku);
        for (const media of medias) {
          // eslint-disable-next-line no-await-in-loop
          await this.deleteProductMedia(uploadedProduct.data.sku, media.id);
        }
      } catch (error: unknown) {
        Logger.log('WebshopService->addProduct', error, 'Art.nr:', product.id);
      }

      await this.uploadMedias(uploadedProduct.data.sku, entries);

      Logger.log('WebshopService->addProduct->Succesfull->Art.nr:', product.id);
    } catch (e) {
      if (e?.status === 400) {
        Logger.error(e.response?.message || e.response || e.message, 'Art.nr:', product.id);
        throw e;
      } else {
        throw e;
      }
    }
  }

  private async getAllEntries(product: ProductRelation): Promise<any[][]> {
    const entriesPromises = product.product_attribute_product_attribute_product_idToproduct.map(async (productAttribute) => {
      let entries = [];
      const isFile = productAttribute?.attribute?.type === AttributeType.TYPE_FILE;
      if (isFile) {
        const fileIds = productAttribute?.value?.split(FILE_VALUE_DELIMITER)
          .filter((n) => !Number.isNaN(Number(n)) && n.trim() !== '')
          .map(Number) || [];

        entries = await this.getEntries(fileIds, this.getProductNameUrl(product));
      }

      return entries;
    });

    return Promise.all(entriesPromises);
  }

  private async getEntries(fileIds: number[], label: string): Promise<any[]> {
    const entryPromises = fileIds.map(async (fileId) => {
      const file = await this.fileService.get(fileId);
      const entry = {
        media_type: 'image',
        label,
        position: 1,
        disabled: false,
        types: [
          'thumbnail', 'image', 'small_image', 'swatch_image',
        ],
        content:
        {
          base64_encoded_data: await file.Body.transformToString('base64'),
          type: file.ContentType,
          name: `${this.generateRandomHash(8)}-${this.generateRandomHash(8)}`,
        },
      };

      return entry;
    });

    return Promise.all(entryPromises);
  }

  private async uploadProduct(product: ProductRelation, availableQuantity: number): Promise<AxiosResponse> {
    let magentoAttrSetId = product.product_type.magento_attr_set_id;
    let magentoGroupSpecId = product.product_type.magento_group_spec_id;
    const customAttributes: MagentoCustomeAttrs[] = [
      {
        attribute_code: 'meta_title',
        value: product.name,
      },
      {
        attribute_code: 'meta_description',
        value: product.description,
      },
      {
        attribute_code: 'short_description',
        value: product.description,
      },
      {
        attribute_code: 'description',
        value: product.description,
      },
      {
        attribute_code: 'tax_class_id',
        value: '2',
      },
    ];

    if (!hasValue(magentoAttrSetId)) {
      magentoAttrSetId = await this.getAttrSetId(product.product_type.name);
      this.productTypeService.update(product.product_type.id, {
        magento_attr_set_id: magentoAttrSetId,
      });
    }
    if (!hasValue(magentoGroupSpecId)) {
      magentoGroupSpecId = await this.getGroupSpecId(magentoAttrSetId);
      this.productTypeService.update(product.product_type.id, {
        magento_group_spec_id: magentoGroupSpecId,
      });
    }

    const otherCustomAttributes = await this.getCustomAttrs({
      product,
      attributeSetId: magentoAttrSetId,
      attributeGroupId: magentoGroupSpecId,
    });
    customAttributes.push(...otherCustomAttributes);

    return this.axiosRequest({
      method: 'POST',
      path: '/products',
      payload: {
        product: {
          sku: product.id,
          name: this.getProductNameId(product),
          attribute_set_id: magentoAttrSetId || 4,
          price: product.price,
          extension_attributes: {
            category_links: product.product_type.magento_category_id ? [
              {
                position: 0,
                category_id: product.product_type.magento_category_id,
              },
            ] : undefined,
            stock_item: {
              qty: availableQuantity,
              is_in_stock: availableQuantity > 0 && product.price > 0,
            },
          },
          custom_attributes: customAttributes,
        },
      },
    });
  }

  private async getAttrSetId(attributeSetName: string): Promise<string> {
    let attrSet: MagentoAttrSet;

    try {
      attrSet = await this.searchAttrSet(attributeSetName);
    } catch (e) {
      attrSet = await this.createAttrSet(attributeSetName);
    }

    return String(attrSet.attribute_set_id);
  }

  private async searchAttrSet(attributeSetName: string): Promise<MagentoAttrSet> {
    const { data } = await this.axiosRequest({
      method: 'GET',
      path: '/products/attribute-sets/sets/list',
      params: {
        'search_criteria[filter_groups][0][filters][0][field]': 'attribute_set_name',
        'search_criteria[filter_groups][0][filters][0][value]': attributeSetName,
        'search_criteria[filter_groups][0][filters][0][condition_type]': 'eq',
      },
    });

    if (data?.items?.[0]) {
      return data?.items?.[0];
    }
    throw new HttpException(`attribute set with name: ${attributeSetName}, not found!`, 404);
  }

  private async createAttrSet(attributeSetName: string): Promise<MagentoAttrSet> {
    const { data } = await this.axiosRequest({
      method: 'POST',
      path: '/products/attribute-sets',
      payload: {
        attributeSet: {
          attribute_set_name: this.firstLetterUpperCase(attributeSetName),
          sort_order: 0,
          entity_type_id: MagentoEntityTypeId.CATALOG_PRODUCT,
        },
        skeletonId: MagentoAttrSetId.DEFAULT,
      },
    });

    return data;
  }

  private async getGroupSpecId(attributeSetId: string): Promise<string> {
    let groupSpecId: string;

    try {
      groupSpecId = await this.findGroupSpecId(attributeSetId);
    } catch (e) {
      if (e.status === 404) {
        groupSpecId = await this.createGroupSpec(attributeSetId);
      } else {
        throw e;
      }
    }

    return groupSpecId;
  }

  private async findGroupSpecId(attributeSetId: string): Promise<string> {
    const { data } = await this.axiosRequest({
      method: 'GET',
      path: '/products/attribute-sets/groups/list',
      params: {
        'search_criteria[filter_groups][0][filters][0][field]': 'attribute_set_id',
        'search_criteria[filter_groups][0][filters][0][value]': attributeSetId,
        'search_criteria[filter_groups][0][filters][0][condition_type]': 'eq',
        'search_criteria[filter_groups][0][filters][1][field]': 'attribute_group_name',
        'search_criteria[filter_groups][0][filters][1][value]': MagentoAttrGroupName.PRODUCT_SPECIFICATIONS,
        'search_criteria[filter_groups][0][filters][1][condition_type]': 'eq',
      },
    });

    if (data?.items?.[0]) {
      return data?.items?.[0].attribute_group_id;
    }
    throw new HttpException(`attribute group with id: ${attributeSetId}, not found!`, 404);
  }

  private async createGroupSpec(attributeSetId: string): Promise<string> {
    const payload = {
      group: {
        attribute_group_name: MagentoAttrGroupName.PRODUCT_SPECIFICATIONS,
        attribute_set_id: attributeSetId,
        extension_attributes: {
          attribute_group_code: MagentoAttrGroupCode.PRODUCT_SPECIFICATIONS,
          sort_order: 11,
        },
      },
    };

    const { data } = await this.axiosRequest({
      method: 'POST',
      path: '/products/attribute-sets/groups',
      payload,
    });

    return data.attribute_group_id;
  }

  private async getCustomAttrs({
    product,
    attributeSetId,
    attributeGroupId,
  }: {
    product: ProductRelation;
    attributeSetId: string;
    attributeGroupId: string;
  }): Promise<MagentoCustomeAttrs[]> {
    const customAttributes: MagentoCustomeAttrs[] = [];

    for (const productAttribute of product.product_attribute_product_attribute_product_idToproduct) {
      const attributeType = productAttribute?.attribute?.type;
      const attributeValue = productAttribute?.value;
      const attributeId = productAttribute?.attribute?.id;
      let attributeCode = productAttribute?.attribute?.magento_attr_code;
      const inAttrSet = product?.product_type?.product_type_attribute
        ?.find((pta) => pta.attribute_id === productAttribute.attribute.id)?.magento_in_attr_set;

      if (![AttributeType.TYPE_TEXT, AttributeType.TYPE_SELECT].includes(attributeType)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (!hasValue(attributeValue)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (!hasValue(attributeCode)) {
        // eslint-disable-next-line no-await-in-loop
        const magentoAttribute = await this.getProductCustomAttr(productAttribute);
        attributeCode = magentoAttribute.attribute_code;

        // eslint-disable-next-line no-await-in-loop
        await this.attributeService.update(productAttribute.attribute_id, {
          magento_attr_code: attributeCode,
        });
      }

      if (attributeCode && !inAttrSet) {
        // eslint-disable-next-line no-await-in-loop
        await this.addAttrToAttrSet({
          attributeSetId,
          attributeGroupId,
          attributeId,
          attributeCode,
        });

        this.productTypeService.updateTypeAttribute(
          product.product_type.id,
          productAttribute.attribute.id,
          {
            magento_in_attr_set: true,
          },
        );
      }

      switch (attributeType) {
        case AttributeType.TYPE_TEXT:
          customAttributes.push({
            attribute_code: attributeCode,
            value: attributeValue,
          });
          break;

        case AttributeType.TYPE_SELECT: {
          // eslint-disable-next-line no-await-in-loop
          const options = await this.getProductAttrOptions(attributeCode);
          const selectedOptionName = productAttribute?.attribute?.attribute_option
            ?.find((option) => option.id === Number(attributeValue))?.name;

          if (!selectedOptionName) {
            break;
          }

          const foundOption = options.find(
            (option) => option.label.toLowerCase() === selectedOptionName?.toLowerCase(),
          );

          if (foundOption) {
            customAttributes.push({
              attribute_code: attributeCode,
              value: foundOption.value,
            });
          } else {
            // eslint-disable-next-line no-await-in-loop
            const optionValue = await this.createProductAttrOptions({
              attributeCode,
              attributeLabel: this.firstLetterUpperCase(selectedOptionName),
            });

            customAttributes.push({
              attribute_code: attributeCode,
              value: optionValue,
            });
          }
          break;
        }

        default:
          break;
      }
    }

    return customAttributes;
  }

  private async uploadMedias(sku: string, entries: any[]): Promise<void> {
    for (const entry of entries) {
      // eslint-disable-next-line no-await-in-loop
      await this.axiosRequest({
        method: 'POST',
        path: `/products/${sku}/media`,
        payload: {
          entry,
        },
      });
    }
  }

  private async getProductCustomAttr(productAttribute: ProductAttributeIncludeAttribute): Promise<MagentoAttr> {
    let productCustomAttr: MagentoAttr;

    try {
      productCustomAttr = await this.searchProductCustomAttr(productAttribute);
    } catch (e) {
      productCustomAttr = await this.createProductCustomAttr(productAttribute);
    }

    return productCustomAttr;
  }

  private async searchProductCustomAttr(productAttribute: ProductAttributeIncludeAttribute): Promise<MagentoAttr> {
    const attributeCode = this.getAttrCode(productAttribute);

    const { data } = await this.axiosRequest({
      method: 'GET',
      path: `/products/attributes/${attributeCode}`,
      retryCount: 0,
    });

    return data;
  }

  private async createProductCustomAttr(productAttribute: ProductAttributeIncludeAttribute): Promise<MagentoAttr> {
    const attributeType = productAttribute?.attribute?.type;
    const attributePayload = {
      attribute: {
        is_html_allowed_on_front: true,
        used_for_sort_by: attributeType !== AttributeType.TYPE_SELECT,
        is_filterable: attributeType === AttributeType.TYPE_SELECT,
        is_filterable_in_search: attributeType === AttributeType.TYPE_SELECT,
        is_used_in_grid: true,
        is_visible_in_grid: true,
        is_filterable_in_grid: true,
        is_searchable: '1',
        is_visible_in_advanced_search: '1',
        is_comparable: '1',
        is_used_for_promo_rules: '1',
        is_visible_on_front: '1',
        used_in_product_listing: '1',
        frontend_input: attributeType === AttributeType.TYPE_SELECT ? MagentoAttrInput.SELECT : MagentoAttrInput.TEXT,
        default_frontend_label: this.firstLetterUpperCase(productAttribute.attribute.name),
        scope: MagentoAttrScope.GLOBAL,
        attribute_code: this.getAttrCode(productAttribute),
        entity_type_id: MagentoEntityTypeId.CATALOG_PRODUCT,
      },
    };

    const { data } = await this.axiosRequest({
      method: 'POST',
      path: '/products/attributes',
      payload: attributePayload,
    });

    return data;
  }

  private async addAttrToAttrSet({
    attributeSetId,
    attributeGroupId,
    attributeId,
    attributeCode,
  }: {
    attributeSetId: string,
    attributeGroupId: string,
    attributeId: number,
    attributeCode: string
  }) {
    const { data } = await this.axiosRequest({
      method: 'POST',
      path: '/products/attribute-sets/attributes',
      payload: {
        attributeSetId,
        attributeGroupId,
        attributeCode,
        sortOrder: attributeId,
      },
    });

    return data;
  }

  private async getProductAttrOptions(attributeCode: string): Promise<MagentoAttrOption[]> {
    const { data } = await this.axiosRequest({
      method: 'GET',
      path: `/products/attributes/${attributeCode}/options`,
    });

    return data;
  }

  private async createProductAttrOptions({ attributeCode, attributeLabel }: { attributeCode: string; attributeLabel: string; }): Promise<string> {
    const { data } = await this.axiosRequest({
      method: 'POST',
      path: `/products/attributes/${attributeCode}/options`,
      payload: {
        option: {
          label: attributeLabel,
        },
      },
    });

    return data;
  }

  private async getProductMedias(sku: string): Promise<any[]> {
    const { data } = await this.axiosRequest({
      method: 'GET',
      path: `/products/${sku}/media`,
    });

    return data;
  }

  private async deleteProductMedia(sku: string, entryId: string): Promise<AxiosResponse> {
    const { data } = await this.axiosRequest({
      method: 'DELETE',
      path: `/products/${sku}/media/${entryId}`,
    });

    return data;
  }

  private async axiosRequest({
    method,
    path,
    params = null,
    payload = null,
    retryCount = 5,
  }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    params?: any;
    payload?: any;
    retryCount?: number;
  }): Promise<AxiosResponse> {
    const url = `${this.configService.get<string>('MAGENTO_BASE_URL')}rest/V1${path}`;
    const headers = {
      Authorization: `Bearer ${this.configService.get<string>('MAGENTO_API_KEY')}`,
    };
    const response = await lastValueFrom(
      this.httpService.request({
        method,
        url,
        headers,
        ...(params && { params }),
        ...(payload && { data: payload }),
      }).pipe(
        retry({
          count: retryCount,
          delay: (_error, index) => {
            Logger.error(method, path, _error);
            return this.fibonacciDelay(index + 1);
          },
        }),
        catchError((error: AxiosError) => {
          throw new HttpException(`Error during ${method} request to ${url}: ${error.message}`, error?.response?.status);
        }),
      ),
    );

    return response as AxiosResponse;
  }

  private generateRandomHash(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let hash = '';
    for (let i = 0; i < length; i++) {
      hash += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return hash;
  }

  private getProductNameId(product: ProductRelation): string {
    return `${product.name.replace(/[^a-zA-Z0-9]/g, '-')}-${product.id}`;
  }

  private getAttrCode(productAttribute: ProductAttributeIncludeAttribute): string {
    return productAttribute.attribute.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  private firstLetterUpperCase(word: string): string {
    return word[0].toLocaleUpperCase() + word.slice(1);
  }

  private getProductNameUrl(product: ProductRelation): string {
    return `${this.getProductNameId(product)}-${this.generateRandomHash(8)}`;
  }

  private fibonacciDelay(attempt: number) {
    const fib = (n: number): number => {
      if (n <= 1) return n;
      return fib(n - 1) + fib(n - 2);
    };
    const delayMs = fib(attempt) * 1000;
    return of(null).pipe(delayWhen(() => of(null).pipe(delay(delayMs))));
  }
}
