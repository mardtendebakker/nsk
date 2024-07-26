import { Prisma, afile as AFileEntity } from '@prisma/client';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as xlsx from 'xlsx';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { LocationService } from '../admin/location/location.service';
import { StockRepository } from './stock.repository';
import { StockProcess } from './stock.process';
import { UpdateManyProductDto } from './dto/update-many-product.dto';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateBodyStockDto } from './dto/update-body-stock.dto';
import { FileService } from '../file/file.service';
import { FileDiscrimination } from '../file/types/file-discrimination.enum';
import { CreateFileDto } from '../file/dto/create-file.dto';
import { AttributeType } from '../attribute/enum/attribute-type.enum';
import { CreateBodyStockDto } from './dto/create-body-stock.dto';
import { PartialProductAttributeIncludeAttribute } from './types/product-attribute-include-attribute';
import { PartialProductRelation, ProductRelation } from './types/product-relation';
import { ProcessedStock } from './dto/processed-stock.dto';
import { ProductAttributeDto } from './dto/product-attribute.dto';
import { FILE_VALUE_DELIMITER } from './types/file-value-delimiter.const';
import { ProductAttributeFile } from './types/product-attribute-file';
import { PutObjectWithoutKeyInput } from '../file/dto/put-object-without-key-input.dto';
import { PrintService } from '../print/print.service';
import { ProductOrderRelation } from './types/product-order-relation';
import { ProductOrderDto } from './dto/find-one-product-response.dto';
import { ProductAttributeProcessed } from './types/product-attribute-processed';
import { ProductRelationAttributeProcessed } from './types/product-relation-attribute-processed';
import { ProductRelationAttributeOrderProcessed } from './types/product-relation-attribute-order-processed';
import { EntityStatus } from '../common/types/entity-status.enum';
import { LocationLabelService } from '../location-label/location-label.service';
import { AttributeIncludeOption } from './types/attribute-include-option';
import { UserLabelPrint } from '../print/types/user-label-print';
import { CompanyLabelPrint } from '../print/types/company-label-print';
import { ProductAttributeUpdateMany } from './types/update-atrribute';
import { AttributeGetPayload } from '../attribute/types/attribute-get-payload';
import { UpdateManyProductResponseDto } from './dto/update-many-product-response.dto';
import { IUploadColumn } from './types/upload-column';
import { UploadProductDto } from './dto/upload-product.dto';

export class StockService {
  constructor(
    protected readonly repository: StockRepository,
    protected readonly locationService: LocationService,
    protected readonly locationLabelService: LocationLabelService,
    protected readonly fileService: FileService,
    protected readonly printService: PrintService,
    protected readonly configService: ConfigService,
    protected readonly httpService: HttpService,
    protected readonly entityStatus: EntityStatus,
  ) {}

  processStock(product: ProductRelation, orderId?: number): ProcessedStock {
    const processProdcut = new StockProcess(product, orderId);
    return processProdcut.run();
  }

  async findAll(query: FindManyDto, email?: string)
    : Promise<{ count: number; data: ProcessedStock[]; }> {
    const {
      where,
      entityStatus,
      orderId,
      excludeByOrderId,
      excludeByOrderDiscr,
      productType,
      location,
      locationLabel,
      productStatus,
      search,
      orderBy,
      select,
      ...restQuery
    } = query;

    const attributeOptionsWhere: Prisma.product_attributeWhereInput[] = [];
    if (search) {
      const attributeOptions = await this.repository.findAttributeOptions({
        name: { contains: search },
      });
      attributeOptions.forEach((attributeOption) => {
        attributeOptionsWhere.push({
          attribute_id: attributeOption.attribute_id,
          value: String(attributeOption.id),
        });
      });
    }

    const productwhere: Prisma.productWhereInput = {
      ...where,
      ...(Number.isFinite(entityStatus) && { entity_status: entityStatus }),
      ...(Number.isFinite(this.entityStatus) && { entity_status: this.entityStatus }),
      ...(orderId || excludeByOrderId || excludeByOrderDiscr || email) && {
        product_order: {
          ...(orderId || email) && {
            some: {
              ...(orderId && { order_id: orderId }),
              ...this.getPartnerWhereInput(email),
            },
          },
          ...(excludeByOrderId && { none: { order_id: excludeByOrderId } }),
          ...(excludeByOrderDiscr && { none: { aorder: { discr: excludeByOrderDiscr } } }),
        },
      },
      ...(productType && { type_id: productType }),
      ...(location && { location_id: location }),
      ...(locationLabel && { location_label_id: locationLabel }),
      ...(productStatus && { product_status: { id: productStatus } }),
      ...(!productStatus && {
        OR: [{
          status_id: null,
        }, {
          product_status: {
            OR: [{
              is_stock: null,
            }, {
              is_stock: true,
            }],
          },
        }],
      }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { sku: { contains: search } },
          { description: { contains: search } },
          {
            product_attribute_product_attribute_product_idToproduct: {
              some: {
                value: { contains: search },
                attribute: { type: AttributeType.TYPE_TEXT },
              },
            },
          },
          {
            product_attribute_product_attribute_product_idToproduct: {
              some: {
                OR: attributeOptionsWhere,
              },
            },
          },
        ],
      }),
    };

    const productOrderBy: Prisma.productOrderByWithRelationInput[] = [];
    if (orderBy) {
      productOrderBy.push(orderBy);
    }
    productOrderBy.push({ id: orderBy?.id ? orderBy.id : 'desc' });

    const result = await this.repository.findAll({
      ...restQuery,
      select: this.processSelect(select),
      where: productwhere,
      orderBy: productOrderBy,
    });

    const data = result.data.map((product) => this.processStock(<ProductRelation>product, orderId));

    return {
      count: result.count,
      // TODO: the out of stock products should be removed by cron job not here by filtering
      data, // .filter(d => d.stock != 0)
    };
  }

  async findOneRelation(id: number): Promise<ProductRelation> {
    return <Promise<ProductRelation>> <unknown> this.repository.findOneSelect({
      id,
      select: this.processSelect(),
    });
  }

  async findAllRelationAttributeProcessed(query: FindManyDto):
  Promise<ProductRelationAttributeProcessed[]> {
    const { data } = await this.repository.findAll({
      ...query,
      select: this.processSelect(query.select),
    });

    return data.map(
      ({
        product_attribute_product_attribute_product_idToproduct,
        ...rest
      }) => ({
        ...rest,
        product_attributes: (
          product_attribute_product_attribute_product_idToproduct
        ).map(this.productAttributeProcess),
      }),
    );
  }

  async findOneCustomSelect(id: number): Promise<ProductRelationAttributeOrderProcessed> {
    const stock = await this.repository.findOneSelect({ id, select: this.processSelect() });
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    const {
      product_order: productOrders,
      product_attribute_product_attribute_product_idToproduct: productAttributes,
      ...rest
    } = stock;

    return {
      ...rest,
      product_orders: productOrders.map(this.productOrderProcess),
      product_attributes: productAttributes.map(this.productAttributeProcess),
    };
  }

  async create(body: CreateBodyStockDto, files?: ProductAttributeFile[]) {
    const {
      product_attributes: productAttributes,
      product_orders: productOrders,
      location_label: locationLabelBody,
      ...rest
    } = body;

    let locationLabelId: number = null;

    if (locationLabelBody) {
      const locationLabel = await this.locationLabelService.findByLabelOrCreate({
        location_id: rest.location_id,
        label: locationLabelBody,
      });

      locationLabelId = locationLabel.id;
    }

    const createInput: Prisma.productUncheckedCreateInput = {
      location_label_id: locationLabelId,
      ...rest,
      ...(!rest.sku && { sku: Math.floor(Date.now() / 1000).toString() }),
      ...(productOrders?.length > 0 && {
        product_order: {
          connectOrCreate: productOrders.map((productOrder) => ({
            where: {
              id: productOrder.order_id,
            },
            create: { ...productOrder },
          })),
        },
      }),
    };

    const stock = await this.repository.create(createInput);

    if (productAttributes?.length || files?.length) {
      return this.updateOne(
        stock.id,
        { type_id: body.type_id, product_attributes: productAttributes },
        files,
      );
    }

    return stock;
  }

  async updateOne(id: number, body: UpdateBodyStockDto, files?: ProductAttributeFile[]) {
    if (!Number.isFinite(id)) {
      throw new Error('product id is required');
    }

    const stock = await this.findOneCustomSelect(id);

    const {
      product_attributes: productAttributes,
      product_orders: productOrders,
      location_label: locationLabelBody,
      ...restBody
    } = body;
    if (productAttributes && !Number.isFinite(body.type_id)) {
      throw new Error('missing type_id in body for updating product_attributes');
    }

    let locationLabelId: number = null;

    if (locationLabelBody !== undefined) {
      if (locationLabelBody) {
        const locationLabel = await this.locationLabelService.findByLabelOrCreate({
          location_id: body.location_id || stock.location.id,
          label: locationLabelBody,
        });

        locationLabelId = locationLabel.id;
      }
    }

    const typeHasChanged = Number.isFinite(body.type_id) && body.type_id !== stock.product_type?.id;

    // check if the product type has changed
    if (typeHasChanged) {
      // generate a new set of product attributes

      await this.generateAllAttributes(id, body.type_id);
    }

    const productAttributeUpdate = await this.processProductAttributeUpdate(
      id,
      body.type_id,
      typeHasChanged,
      files,
      productAttributes,
    );

    return this.repository.updateOne({
      id,
      data: {
        ...restBody,
        ...(locationLabelBody !== undefined && { location_label_id: locationLabelId }),
        ...(productOrders?.length && {
          product_order: {
            update: productOrders.map((productOrder) => ({
              where: {
                id: productOrder.id,
              },
              data: { ...productOrder },
            })),
          },
        }),
        ...(productAttributeUpdate && {
          product_attribute_product_attribute_product_idToproduct: productAttributeUpdate,
        }),
      },
    });
  }

  async deleteOne(id: number) {
    await this.deleteAllAttributes(id);
    return this.repository.deleteOne(id);
  }

  async updateMany(updateManyProductDto: UpdateManyProductDto): Promise<UpdateManyProductResponseDto> {
    const {
      ids, product: {
        locationId, locationLabel: locationLabelBody, productTypeId, entityStatus, orderUpdatedAt,
      },
    } = updateManyProductDto;

    const totalUpdated = updateManyProductDto.ids.length;
    if (totalUpdated === 0) return Promise.resolve({ affected: 0 });

    let locationLabelId: number;

    if (locationLabelBody) {
      const locationLabel = await this.locationLabelService
        .findByLabelOrCreate({ location_id: locationId, label: locationLabelBody });

      locationLabelId = locationLabel.id;
    }

    if (productTypeId) {
      await this.repository.updateManyProductTypeId({ ids, productTypeId });
    } else {
      await this.repository.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          ...(Number.isFinite(locationId) && { location_id: locationId }),
          ...(Number.isFinite(locationLabelId) && { location_label_id: locationLabelId }),
          ...(Number.isFinite(entityStatus) && { entity_status: entityStatus }),
          ...(orderUpdatedAt && { order_updated_at: orderUpdatedAt }),
        },
      });
    }

    return { affected: totalUpdated };
  }

  async archiveAllSoldOut() {
    const take = this.configService.get<number>('MAX_RELATION_QUERY_LIMIT') || 100;
    let cursor;
    let hasNextPage = true;

    const archiveManyProductDto: UpdateManyProductDto = {
      ids: [],
      product: {
        entityStatus: EntityStatus.Archived,
      },
    };

    while (hasNextPage) {
      // eslint-disable-next-line no-await-in-loop
      const { data } = await this.findAll({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: 'asc' },
      });

      for (const product of data) {
        if (product.purch !== 0 && product.purch === product.sold) {
          archiveManyProductDto.ids.push(product.id);
        }
      }

      if (data.length < take) {
        hasNextPage = false;
      } else {
        cursor = data[data.length - 1].id;
      }
    }

    return this.updateMany(archiveManyProductDto);
  }

  async getAllPublicTypes() {
    return this.repository.getAllTypes({
      is_public: true,
    });
  }

  async printBarcodes(ids: number[]) {
    const products = await this.repository.findBy({
      where: { id: { in: ids } },
      select: {
        sku: true,
      },
    });

    const skusToPrint = products.map((product) => product.sku);
    return this.printService.printBarcodes(skusToPrint);
  }

  async printChecklists(ids: number[]) {
    const { data } = await this.findAll({ where: { id: { in: ids } } });
    return this.printService.printChecklists(data);
  }

  async printPriceCards(ids: number[]) {
    const products = await this.findAllRelationAttributeProcessed({ where: { id: { in: ids } } });
    return this.printService.printPriceCards(products);
  }

  async printLabels({
    ids,
    user,
  }: {
    ids: number[],
    user: UserLabelPrint,
  }) {
    const products = await this.findAllRelationAttributeProcessed({ where: { id: { in: ids } } });
    const productLabelPrint: CompanyLabelPrint = {
      company_name: this.configService.get('COMPANY_NAME'),
      address: this.configService.get('COMPANY_ADDRESS'),
      email: this.configService.get('COMPANY_EMAIL'),
    };
    const productsWithUser = products
      .map((product) => ({ ...product, ...user, ...productLabelPrint }));

    return this.printService.printLabels(productsWithUser);
  }

  async preapareProductAttributeByStringValue(
    attribute: AttributeIncludeOption,
    reportValue: string,
  ): Promise<ProductAttributeDto> {
    let value: string;

    switch (attribute.type) {
      case AttributeType.TYPE_TEXT:
        value = reportValue;
        break;
      case AttributeType.TYPE_SELECT:
        value = String((await this.repository
          .getOptionByAttrIdAndName(attribute.id, reportValue)).id);
        break;
      default:
        value = null;
        break;
    }

    return {
      attribute_id: attribute.id,
      value,
    };
  }

  private productAttributeProcess(
    productAttribute: PartialProductAttributeIncludeAttribute,
  ): ProductAttributeProcessed {
    const { attribute } : { attribute?: AttributeGetPayload } = productAttribute;
    const productAttributeProcessed: ProductAttributeProcessed = { ...productAttribute, attribute };

    if (attribute.type === AttributeType.TYPE_TEXT) {
      productAttributeProcessed.totalStandardPrice = productAttribute.value ? attribute.price : 0;
    }
    if (attribute.type === AttributeType.TYPE_SELECT) {
      const selectedOption = attribute.attribute_option
        ?.find((option) => option.id === Number(productAttribute.value));
      productAttributeProcessed.selectedOption = selectedOption;
      productAttributeProcessed.totalStandardPrice = selectedOption?.price ?? 0;
    }
    if (attribute.type === AttributeType.TYPE_PRODUCT) {
      const valueProduct = productAttribute.product_product_attribute_value_product_idToproduct;
      const quantity = productAttribute.quantity ?? 1;
      productAttributeProcessed.valueProduct = valueProduct;
      productAttributeProcessed.totalStandardPrice = (valueProduct?.price ?? 0) * quantity;
    }

    return productAttributeProcessed;
  }

  private productOrderProcess(productOrder: ProductOrderRelation): ProductOrderDto {
    const order = productOrder?.aorder;
    return {
      quantity: productOrder?.quantity,
      order: order && {
        id: order.id,
        order_nr: order.order_nr,
        order_date: order.order_date,
        discr: order.discr,
        contact:
          order?.contact_aorder_customer_idTocontact?.name
          || order?.contact_aorder_supplier_idTocontact?.name,
        company:
          order?.contact_aorder_customer_idTocontact?.company_contact_company_idTocompany?.name
          || order?.contact_aorder_supplier_idTocontact?.company_contact_company_idTocompany?.name,
        status: order?.order_status?.name,
      },
    };
  }

  private processSelect(select: Prisma.productSelect = {}): Prisma.productSelect {
    const locationSelect: Prisma.locationSelect = {
      id: true,
      name: true,
      location_template: true,
    };

    const locationLabelSelect: Prisma.location_labelSelect = {
      id: true,
      label: true,
    };

    const productTypeSelect: Prisma.product_typeSelect = {
      id: true,
      name: true,
      magento_category_id: true,
      product_type_task: {
        select: {
          task: true,
        },
      },
    };

    const productStatusSelect: Prisma.product_statusSelect = {
      id: true,
      name: true,
      is_stock: true,
      is_saleable: true,
    };

    const aorderSelect: Prisma.aorderSelect = {
      id: true,
      order_date: true,
      order_nr: true,
      discr: true,
      contact_aorder_customer_idTocontact: {
        select: {
          name: true,
          company_contact_company_idTocompany: {
            select: {
              name: true,
            },
          },
        },
      },
      contact_aorder_supplier_idTocontact: {
        select: {
          name: true,
          company_contact_company_idTocompany: {
            select: {
              name: true,
            },
          },
        },
      },
      order_status: {
        select: {
          name: true,
        },
      },
      repair: {
        select: {
          id: true,
        },
      },
    };

    const serviceSelect: Prisma.aserviceSelect = {
      id: true,
      description: true,
      price: true,
      task_id: true,
      status: true,
    };

    const productOrderSelect: Prisma.product_orderSelect = {
      id: true,
      quantity: true,
      price: true,
      order_id: true,
      aorder: {
        select: aorderSelect,
      },
      aservice: {
        select: serviceSelect,
      },
    };

    const attributeSelect: Prisma.attributeSelect = {
      name: true,
      price: true,
      type: true,
      has_quantity: true,
      attribute_option: true,
    };

    const productAttributedSelect: Prisma.productSelect = {
      price: true,
    };

    const productAttributeSelect: Prisma.product_attributeSelect = {
      attribute: {
        select: attributeSelect,
      },
      attribute_id: true,
      value: true,
      value_product_id: true,
      quantity: true,
      product_product_attribute_value_product_idToproduct: {
        select: productAttributedSelect,
      },
    };

    const afileSelect: Prisma.afileSelect = {
      id: true,
      unique_server_filename: true,
      original_client_filename: true,
      discr: true,
    };

    return {
      ...select,
      id: true,
      sku: true,
      name: true,
      price: true,
      entity_status: true,
      description: true,
      location: {
        select: locationSelect,
      },
      location_label: {
        select: locationLabelSelect,
      },
      product_status: {
        select: productStatusSelect,
      },
      product_type: {
        select: productTypeSelect,
      },
      product_order: {
        select: productOrderSelect,
      },
      product_attribute_product_attribute_product_idToproduct: {
        select: productAttributeSelect,
      },
      afile: {
        select: afileSelect,
      },
      created_at: true,
      updated_at: true,
    };
  }

  private addAttributeRelationToProductAttributes(
    productId: number,
    attributes: AttributeIncludeOption[],
    productAttributes: ProductAttributeDto[],
    inclusive = false,
  ): PartialProductAttributeIncludeAttribute[] {
    const newProductAttributesIncludeAttribute: PartialProductAttributeIncludeAttribute[] = [];

    for (let i = 0; i < attributes.length; i += 1) {
      const attribute = attributes[i];
      let attributeFound = false;

      for (let j = 0; j < productAttributes.length; j += 1) {
        const productAttribute = productAttributes[j];

        if (attribute.id === productAttribute.attribute_id) {
          newProductAttributesIncludeAttribute.push({
            product_id: productId,
            ...productAttribute,
            attribute,
          });

          attributeFound = true;
          break;
        }
      }

      if (!attributeFound && inclusive) {
        newProductAttributesIncludeAttribute.push({
          product_id: productId,
          attribute_id: attribute.id,
          quantity: null,
          value: '',
          external_id: null,
          value_product_id: null,
          attribute,
        });
      }
    }

    return newProductAttributesIncludeAttribute;
  }

  private async generateAllAttributes(productId: number, typeId: number) {
    if (!Number.isFinite(productId)) {
      throw new Error('productId must be provided');
    }
    if (!Number.isFinite(typeId)) {
      return null;
    }

    await this.deleteAllAttributes(productId);
    const allAttributes = await this.repository.getAttributesByProductTypeId(typeId);
    const productAttributes: Prisma.product_attributeCreateManyInput[] = [];
    for (let i = 0; i < allAttributes.length; i += 1) {
      const attribute = allAttributes[i];

      const productAttribute: Prisma.product_attributeCreateManyInput = {
        product_id: productId,
        attribute_id: attribute.id,
        value: '',
      };

      productAttributes.push(productAttribute);
    }

    return this.repository.addProductAttributes(productAttributes);
  }

  private async deleteAllAttributes(productId: number) {
    const productAttributes = await this.repository
      .findProductAttributesIncludeAttribute(productId);

    const result = await this.repository.deleteProductAttributes(productId);

    for (let i = 0; i < productAttributes.length; i += 1) {
      const productAttribute = productAttributes[i];

      if (productAttribute.attribute.type === AttributeType.TYPE_FILE
        && productAttribute.value) {
        productAttribute.value = productAttribute.value || '';
        const fileIds = productAttribute.value
          .split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number);
        this.fileService.deleteMany(fileIds);
      }
    }

    return result;
  }

  private async uploadFiles(productId: number, files: Array<PutObjectWithoutKeyInput> = []) {
    if (!Number.isFinite(productId)) {
      throw new Error('productId must be provided');
    }
    const filesUploadedP: Promise<AFileEntity>[] = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];

      const createFileDto: CreateFileDto = {
        discr: FileDiscrimination.PRODUCT_ATTRIBUTE_FILE,
        product_id: productId,
      };

      filesUploadedP.push(
        this.fileService.create(createFileDto, {
          ...file,
        }),
      );
    }

    const filesUploaded = await Promise.all(filesUploadedP);

    return filesUploaded.map((fileUploaded) => fileUploaded.id);
  }

  private async processProductAttributeUpdate(
    productId: number,
    productTypeId: number,
    typeHasChanged: boolean,
    files: ProductAttributeFile[] = [],
    productAttributes: ProductAttributeDto[] = [],
  ): Promise<ProductAttributeUpdateMany> {
    if (!Number.isFinite(productId)) {
      throw new Error('productId must be provided');
    }
    if (!Number.isFinite(productTypeId)) {
      return null;
    }
    if (productAttributes.length === 0 && files.length === 0) {
      return null;
    }

    // add attribute to body.product_attributes
    // to be able to check the attribute.type
    const attributes = await this.repository.getAttributesByProductTypeId(productTypeId);

    const newProductAttributesIncludeAttribute = this.addAttributeRelationToProductAttributes(
      productId,
      attributes,
      productAttributes,
    );

    const oldProductAttributesIncludeAttribute = await this.repository
      .findProductAttributesIncludeAttribute(productId);

    const oldFileProductAttributes = oldProductAttributesIncludeAttribute
      .filter((productAttribute) => productAttribute?.attribute?.type
        === AttributeType.TYPE_FILE);
    const newFileProductAttributes = newProductAttributesIncludeAttribute
      .filter((productAttribute) => productAttribute?.attribute?.type
        === AttributeType.TYPE_FILE);

    // the file ids that user just removed them
    const fileIdsDeleteds: Record<string, number[]> = {};
    // the file ids that should be kept
    const fileIdsKepts: Record<string, number[]> = {};

    for (let i = 0; i < oldFileProductAttributes.length; i += 1) {
      const oldFileProductAttribute = oldFileProductAttributes[i];
      oldFileProductAttribute.value = oldFileProductAttribute.value || '';
      let productAttributeFound = false;

      for (let j = 0; j < newFileProductAttributes.length; j += 1) {
        const newFileProductAttribute = newFileProductAttributes[j];

        if (oldFileProductAttribute.attribute_id === newFileProductAttribute.attribute_id) {
          // the file ids that must be deleted
          fileIdsDeleteds[oldFileProductAttribute.attribute_id] = oldFileProductAttribute.value
            .split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number).filter(
              (fileId) => !newFileProductAttribute?.value?.split(FILE_VALUE_DELIMITER)
                .filter(Boolean).map(Number).includes(fileId),
            );
          // the file ids that must be kept
          fileIdsKepts[oldFileProductAttribute.attribute_id] = oldFileProductAttribute.value
            .split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number).filter(
              (fileId) => newFileProductAttribute?.value
                ?.split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number).includes(fileId),
            );
          productAttributeFound = true;
          break;
        }
      }

      if (!productAttributeFound) {
        // should be kept beacause the product_attribute was not provided
        fileIdsKepts[oldFileProductAttribute.attribute_id] = oldFileProductAttribute.value
          .split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number);
      }
    }

    // check if the product attributes have not already been deleted
    if (!typeHasChanged) {
      // then delete those files
      Object.values(fileIdsDeleteds).forEach((fileIdsDeleted) => {
        if (fileIdsDeleted?.length) {
          this.fileService.deleteMany(fileIdsDeleted);
        }
      });
    }

    // group files by attribute id
    const filesGroupByAttributeId:
    Record<string, ProductAttributeFile[]> = files.reduce((acc, obj) => {
      const { fieldname } = obj;

      if (!acc[fieldname]) {
        acc[fieldname] = [];
      }

      acc[fieldname].push(obj);
      return acc;
    }, {}) || {};

    const uploadedIdsGroupByAttributeId: Record<string, number[]> = {};
    for (const [fileAttributeId, uploadedFiles] of Object.entries(filesGroupByAttributeId)) {
      // Upload all new files
      // eslint-disable-next-line no-await-in-loop
      const fileIdsUploaded = await this.uploadFiles(
        productId,
        uploadedFiles.map((file) => ({
          Body: file.buffer,
          ContentType: file.mimetype,
        })),
      );
      // Keep all file ids
      uploadedIdsGroupByAttributeId[fileAttributeId] = fileIdsUploaded;
    }

    // get all productAttributes
    let productAttributeInclusive = this.addAttributeRelationToProductAttributes(
      productId,
      attributes,
      productAttributes,
      true,
    );

    // store the all file ids to the product_attribute.value in comma-separated format
    for (let i = 0; i < productAttributeInclusive.length; i += 1) {
      if (productAttributeInclusive[i].attribute.type === AttributeType.TYPE_FILE) {
        productAttributeInclusive[i].value = '';

        // Update product attribute values based on fileIdsKepts
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        Object.entries(fileIdsKepts).forEach(([fileAttributeId, fileIds]) => {
          productAttributeInclusive = this
            .updateFileAttributes(Number(fileAttributeId), fileIds, productAttributeInclusive);
        });

        // Update product attribute values based on uploadedIdsGroupByAttributeId
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        Object.entries(uploadedIdsGroupByAttributeId).forEach(([fileAttributeId, fileIds]) => {
          productAttributeInclusive = this
            .updateFileAttributes(Number(fileAttributeId), fileIds, productAttributeInclusive);
        });
      }
    }

    const productAttributeUpdate: ProductAttributeUpdateMany = {
      upsert: productAttributeInclusive.map(
        (newProductAttributeIncludeAttribute) => ({
          where: {
            product_id_attribute_id: {
              attribute_id: newProductAttributeIncludeAttribute.attribute_id,
              product_id: newProductAttributeIncludeAttribute.product_id,
            },
          },
          update: {
            value: newProductAttributeIncludeAttribute.value,
          },
          create: {
            attribute_id: newProductAttributeIncludeAttribute.attribute_id,
            value: newProductAttributeIncludeAttribute.value,
          },
        }),
      ),
    };

    return productAttributeUpdate;
  }

  private updateFileAttributes<T extends PartialProductAttributeIncludeAttribute>(
    attributeId: number,
    fileIds: number[],
    productAttributeInclusive: T[],
  ): T[] {
    const updatedAttributes = productAttributeInclusive.map((attr) => {
      if (attr.attribute_id === attributeId) {
        const values = attr.value.split(FILE_VALUE_DELIMITER)
          .filter(Boolean)
          .map(Number);
        const updatedValue = [...values, ...fileIds]
          .filter(Boolean)
          .join(FILE_VALUE_DELIMITER);
        return { ...attr, value: updatedValue };
      }
      return attr;
    });

    return updatedAttributes;
  }

  private getPartnerWhereInput(email?: string): Prisma.product_orderWhereInput {
    return {
      ...(email && {
        aorder: {
          OR: [
            { contact_aorder_customer_idTocontact: this.getContactWhereInput(email) },
            { contact_aorder_supplier_idTocontact: this.getContactWhereInput(email) },
          ],
        },
      }),
    };
  }

  private getContactWhereInput(email?: string): Prisma.contactWhereInput {
    return {
      ...(email && {
        OR: [
          { email },
          {
            company_contact_company_idTocompany: {
              company: { companyContacts: { some: { email } } },
            },
          },
        ],
      }),
    };
  }

  async uploadFromExcel(params: UploadProductDto, file: Express.Multer.File): Promise<PartialProductRelation[]> {
    const rows = this.getFirstSheetOfUploadedExcel(file);

    const products: PartialProductRelation[] = [];

    for (const row of rows) {
      try {
        const product = await this.processProductRow(params, row);
        products.push(product);
      } catch (e) {
        throw new UnprocessableEntityException(`Error processing row with Artnr ${row.Artnr}:`, e);
      }
    }

    return products;
  }

  private async processProductRow(params: UploadProductDto, row: IUploadColumn): Promise<PartialProductRelation> {
    const {
      Artnr,
      Omschrijving,
      Levertijd,
      'Netto inkoopprijs': NettoInkoopprijs,
      'Afbeelding 1': Afbeelding1,
      'Afbeelding 2': Afbeelding2,
      Kleur,
      Fabrikant,
      'Kabel Lengte': KabelLengte,
      Cat,
      'Managed / Unmanaged': ManagedUnmanaged,
      Maat,
      Hoogte,
      Diepte,
      Verpakking,
      Breedte,
    } = row;

    const productAttributeFiles = await this.uploadProductFiles([Afbeelding1, Afbeelding2]);

    const OmschrijvingArr = Omschrijving.split(',').map((item) => item.trim());

    const name = OmschrijvingArr.shift();

    const description = [
      OmschrijvingArr.length ? OmschrijvingArr.join('\n') : '',
      Levertijd || '',
      Kleur || '',
      Fabrikant || '',
      KabelLengte || '',
      Cat || '',
      ManagedUnmanaged || '',
      Maat || '',
      Hoogte || '',
      Diepte || '',
      Verpakking || '',
      Breedte || '',
    ].filter((part) => part).join('\n');

    const overigType = 24;

    const price = Number(NettoInkoopprijs);

    const productDto: CreateBodyStockDto = {
      name,
      sku: Artnr,
      location_id: 1,
      description,
      type_id: overigType,
      price,
      product_orders: [
        {
          order_id: params.orderId,
          quantity: 1,
        },
      ],
    };

    return this.create(productDto, productAttributeFiles);
  }

  private async uploadProductFiles(urls: string[]): Promise<ProductAttributeFile[]> {
    const productAttributeFiles: ProductAttributeFile[] = [];
    for (const url of urls) {
      if (url) {
        productAttributeFiles.push(await this.downloadFileFromUrl(url));
      }
    }

    return productAttributeFiles;
  }

  private getFirstSheetOfUploadedExcel(file: Express.Multer.File): IUploadColumn[] {
    if (!file) {
      throw new UnprocessableEntityException('file is invalid');
    }
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet, { rawNumbers: false });
  }

  private async downloadFileFromUrl(url: string): Promise<ProductAttributeFile | never> {
    const IMAGE_ATTRIBUTE_ID = '15';
    if (!url) {
      return null;
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { responseType: 'arraybuffer' }),
      );
      const productAttributeFile: ProductAttributeFile = {
        buffer: response.data,
        fieldname: IMAGE_ATTRIBUTE_ID,
        mimetype: response.headers['content-type'],
      };

      return productAttributeFile;
    } catch (e) { return null; }
  }
}
