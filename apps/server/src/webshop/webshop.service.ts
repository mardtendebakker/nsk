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
import { MagentoCustomeAttributes } from './types/magento-custom-attributes';
import { hasValue } from '../common/util/has-value';
import { MagentoAttributeOption } from './types/magento-attribute-option';

@Injectable()
export class WebshopService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private fileService: FileService,
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
        Logger.log('WebshopService->addProduct', error);
      }

      await this.uploadMedias(uploadedProduct.data.sku, entries);

      Logger.log('WebshopService->addProduct->Succesfull');
    } catch (e) {
      if (e?.status === 400) {
        Logger.error(e?.response?.message);
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
    const magentoAttrSetId = Number(product.product_type.magento_attr_set_id);
    const customAttributes: MagentoCustomeAttributes[] = [
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
    ];

    if (magentoAttrSetId) {
      const otherCustomAttributes = await this.getCustomAttributes(product);
      customAttributes.push(...otherCustomAttributes);
    }

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

  private async getCustomAttributes(product: ProductRelation): Promise<MagentoCustomeAttributes[]> {
    const customAttributePromises = product.product_attribute_product_attribute_product_idToproduct.map(async (productAttribute) => {
      const attributeType = productAttribute?.attribute?.type;
      const attributeCode = productAttribute?.attribute?.magento_attr_code;
      const attributeValue = productAttribute?.value;

      if (!hasValue(attributeCode) || !hasValue(attributeValue)) return null;

      switch (attributeType) {
        case AttributeType.TYPE_TEXT:
          return {
            attribute_code: attributeCode,
            value: attributeValue,
          };

        case AttributeType.TYPE_SELECT: {
          const options = await this.getProductAttributeOptions(attributeCode);
          const selectedOptionName = productAttribute?.attribute?.attribute_option
            ?.find((option) => option.id === Number(attributeValue))?.name;

          const foundOption = options.find((option) => option.label.toLocaleLowerCase() === selectedOptionName?.toLocaleLowerCase());

          if (foundOption) {
            return {
              attribute_code: attributeCode,
              value: foundOption.value,
            };
          }

          const optionValue = await this.createProductAttributeOptions({
            attributeCode,
            attributeLabel: selectedOptionName[0].toUpperCase() + selectedOptionName.slice(1),
          });

          return {
            attribute_code: attributeCode,
            value: optionValue,
          };
        }

        default:
          return null;
      }
    });

    return (await Promise.all(customAttributePromises)).filter(Boolean);
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

  private async getProductAttributeOptions(attributeCode: string): Promise<MagentoAttributeOption[]> {
    const { data } = await this.axiosRequest({
      method: 'GET',
      path: `/products/attributes/${attributeCode}/options`,
    });

    return data;
  }

  private async createProductAttributeOptions({ attributeCode, attributeLabel }: { attributeCode: string; attributeLabel: string; }): Promise<string> {
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
    payload = null,
  }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    payload?: any;
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
        ...(payload ? { data: payload } : {}),
      }).pipe(
        retry({
          count: 5,
          delay: (_error, index) => this.fibonacciDelay(index + 1),
        }),
        catchError((error: AxiosError) => {
          throw new HttpException(`Error during ${method} request to ${url}: ${error.message}`, error?.response?.status);
        }),
      ),
    );

    return response;
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
    return `${product.name.replace(/ /g, '-')}-${product.id}`;
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
