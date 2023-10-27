import { Prisma, attribute } from "@prisma/client";
import { LocationService } from "../location/location.service";
import { StockRepository } from "./stock.repository";
import { StockProcess } from "./stock.process";
import { UpdateManyProductDto } from "./dto/update-many-product.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { UpdateBodyStockDto } from "./dto/update-body-stock.dto";
import { FileService } from "../file/file.service";
import { FileDiscrimination } from "../file/types/file-discrimination.enum";
import { CreateFileDto } from "../file/dto/create-file.dto";
import { AttributeType } from "../attribute/enum/attribute-type.enum";
import { CreateBodyStockDto } from "./dto/create-body-stock.dto";
import { NotFoundException } from "@nestjs/common";
import { ProductAttributeIncludeAttribute } from "./types/product-attribute-include-attribute";
import { ProductRelation } from "./types/product-relation";
import { ProcessedStock } from "./dto/processed-stock.dto";
import { ProductAttributeDto } from "./dto/product-attribute.dto";
import { FILE_VALUE_DELIMITER } from "./types/file-value-delimiter.const";
import { ProductAttributeFile } from "./types/product-attribute-file";
import { PutObjectWithoutKeyInput } from "../file/dto/put-object-without-key-input.dto";
import { PrintService } from "../print/print.service";
import { ProductOrderRelation } from "./types/product-order-relation";
import { ProductOrderDto } from "./dto/find-one-product-response.dto";
import { AOrderPayload } from "../aorder/types/aorder-payload";
import { AttributeGetPayload } from "../attribute/types/attribute-get-payload";
import { ProductAttributeProcessed } from "./types/product-attribute-processed";
import { ProductRelationAttributeProcessed } from "./types/product-relation-attribute-processed";
import { ProductRelationAttributeOrderProcessed } from "./types/product-relation-attribute-order-processed";
import { EntityStatus } from "../common/types/entity-status.enum";
import { LocationLabelService } from "../location-label/location-label.service";

export class StockService {
  constructor(
    protected readonly repository: StockRepository,
    protected readonly locationService: LocationService,
    protected readonly locationLabelService: LocationLabelService,
    protected readonly fileService: FileService,
    protected readonly printService: PrintService,
    protected readonly entityStatus: EntityStatus,
  ) {}

  processStock(product: ProductRelation, orderId?: number): ProcessedStock {
    const processProdcut = new StockProcess(product, orderId);
    return processProdcut.run();
  }

  async findAll(query: FindManyDto) {
    const productwhere: Prisma.productWhereInput = {
      ...query.where,
      ...(Number.isFinite(query.entityStatus) && { entity_status: query.entityStatus }),
      ...(Number.isFinite(this.entityStatus) && { entity_status: this.entityStatus }),
      ...(query.orderId || query.excludeByOrderId || query.excludeByOrderDiscr) && {
        product_order: {
          ...(query.orderId && { some: { order_id: query.orderId } }),
          ...(query.excludeByOrderId && { none: { order_id: query.excludeByOrderId } }),
          ...(query.excludeByOrderDiscr && { none: { aorder: { discr: query.excludeByOrderDiscr } } }),
        },
      },
      ...(query.productType && { type_id: query.productType }),
      ...(query.location && { location_id: query.location }),
      ...(query.location_label && { location_label_id: query.location_label }),
      ...(query.productStatus && {product_status: { id: query.productStatus }} || {
        OR: [{
          status_id: null,
        }, {
          product_status: {
            OR: [{
              is_stock: null
            }, {
              is_stock: true
            }]
          }
        }],
      }),
      ...(query.search && {
        OR: [{name: {contains: query.search}}, {sku: { contains: query.search}}]
      }),
    }

    const productOrderBy: Prisma.productOrderByWithRelationInput[] = query.orderBy || [
      {
        id: 'desc',
      },
    ];

    const result = await this.repository.findAll({
      ...query,
      select: this.processSelect(query.select),
      where: productwhere,
      orderBy: productOrderBy,
    });

    const data = result.data.map(product => {
      return this.processStock(product, query.orderId);
    });

    return {
      count: result.count,
      data: data//.filter(d => d.stock != 0) // TODO: the out of stock products should be removed by cron job not here by filtering
    };
  }

  async findOneRelation(id: number) {
    return this.repository.findOneSelect({
      id,
      select: this.processSelect(),
    });
  }
  
  async findAllRelationAttributeProcessed(query: FindManyDto): Promise<ProductRelationAttributeProcessed[]> {
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
      })
    );
  }

  async findOneCustomSelect(id: number): Promise<ProductRelationAttributeOrderProcessed> {
    const stock = await this.repository.findOneSelect({ id, select: this.processSelect() });
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    const {
      product_order,
      product_attribute_product_attribute_product_idToproduct,
      ...rest
    } = stock;

    const product_attributes = product_attribute_product_attribute_product_idToproduct

    return {
      ...rest,
      product_orders: product_order.map(this.productOrderProcess),
      product_attributes: product_attributes.map(this.productAttributeProcess),
    };
  }

  async create(body: CreateBodyStockDto, files?: ProductAttributeFile[]) {
    const {
      product_attributes,
      product_orders,
      location_label,
      ...rest
    } = body;

    let location_label_id: number;

    if (location_label) {
      const locationLabel = await this.locationLabelService.findByLabelOrCreate({
        location_id: rest.location_id,
        label: location_label,
      });

      location_label_id = locationLabel.id;
    }
    
    const createInput: Prisma.productUncheckedCreateInput = {
      ...rest,
      ...(!rest.sku && { sku: Math.floor(Date.now() / 1000).toString() }),
      ...(location_label_id && { location_label_id }),
      ...(product_orders?.length > 0 && {
        product_order: {
          connectOrCreate: product_orders.map(product_order => ({
            where: {
              id: product_order.order_id
            },
            create: { ...product_order }
          })),
        },
      })
    };

    const stock = await this.repository.create(createInput);

    if (product_attributes?.length) {
      return this.updateOne(
        stock.id,
        { type_id: body.type_id, product_attributes },
        files
      );
    }

    return stock;
  }

  async updateOne(id: number, body: UpdateBodyStockDto, files?: ProductAttributeFile[]) {
    if (!Number.isFinite(id)) {
      throw new Error("product id is required");
    }

    const stock = await this.findOneCustomSelect(id);

    const { product_attributes, product_orders, location_label, ...restBody } = body;
    if (product_attributes && !Number.isFinite(body.type_id)) {
      throw new Error("missing type_id in body for updating product_attributes");
    }

    let location_label_id: number;

    if (location_label) {
      const locationLabel = await this.locationLabelService.findByLabelOrCreate({
        location_id: stock.location.id,
        label: location_label,
      });

      location_label_id = locationLabel.id;
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
      product_attributes,
      typeHasChanged,
      files,
    );
    
    return this.repository.updateOne({
      id,
      data: {
        ...restBody,
        ...(location_label_id && { location_label_id }),
        ...(product_orders?.length && {
          product_order: {
            update: product_orders.map(product_order => ({
              where: {
                id: product_order.id
              },
              data: { ...product_order },
            })),
          },
        }),
        ...(productAttributeUpdate && {
          product_attribute_product_attribute_product_idToproduct: productAttributeUpdate
        }),
      },
    });
  }

  async deleteOne(id: number) {
    await this.deleteAllAttributes(id);
    return this.repository.deleteOne(id);
  }

  async updateMany(ids: number[], data: Prisma.productUncheckedUpdateManyInput) {
    return this.repository.updateMany({
      where: {
        id: { in: ids },
      },
      data,
    });
  }

  async updateManyLocation(updateManyProductDto: UpdateManyProductDto) {
    const { ids, product } = updateManyProductDto;
    return this.updateMany(ids, product);
  }

  async getAllPublicTypes() {
    return this.repository.getAllTypes({
      is_public: true
    });
  }

  async printBarcodes(ids: number[]) {
    const products = await this.repository.findBy({
      where: { id: { in: ids } },
      select: {
        sku: true,
      },
    });
  
    const skusToPrint = products.map(product => product.sku);
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

  private productAttributeProcess(productAttribute: ProductAttributeIncludeAttribute): ProductAttributeProcessed {
    const attribute: AttributeGetPayload = productAttribute.attribute;
    const productAttributeProcessed: ProductAttributeProcessed = { ...productAttribute, attribute };
    
    if (attribute.type === AttributeType.TYPE_TEXT) {
      productAttributeProcessed.totalStandardPrice = productAttribute.value ? attribute.price : 0;
    }
    if (attribute.type === AttributeType.TYPE_SELECT) {
      const selectedOption=  attribute.attribute_option?.find(option => option.id === Number(productAttribute.value));
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
    const order = <AOrderPayload>productOrder?.aorder;
    return {
      quantity: productOrder?.quantity,
      order: order && {
        id: order.id,
        order_nr: order.order_nr,
        order_date: order.order_date,
        discr: order.discr,
        company:
          order?.acompany_aorder_customer_idToacompany?.name ||
          order?.acompany_aorder_supplier_idToacompany?.name,
        status: order?.order_status?.name,
      },
    };
  }

  private processSelect(select: Prisma.productSelect = {}): Prisma.productSelect {
    const locationSelect: Prisma.locationSelect = {
      id: true,
      name: true,
    };

    const locationLabelSelect: Prisma.location_labelSelect = {
      id: true,
      label: true,
    };

    const productTypeSelect: Prisma.product_typeSelect = {
      id: true,
      name: true,
      product_type_task: {
        select: {
          task: true,
        }
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
      acompany_aorder_customer_idToacompany: {
        select: {
          name: true,
        },
      },
      acompany_aorder_supplier_idToacompany: {
        select: {
          name: true,
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
      }
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
        select: afileSelect
      },
      created_at: true,
      updated_at: true
    };
  }

  private addAttributeRelationToProductAttributes(
    productId: number,
    attributes: attribute[],
    productAttributes: ProductAttributeDto[],
    inclusive = false,
  ): ProductAttributeIncludeAttribute[] {

    const newProductAttributesIncludeAttribute:
      ProductAttributeIncludeAttribute[] = [];

    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      let attributeFound = false;

      for (let j = 0; j < productAttributes.length; j++) {
        const productAttribute = productAttributes[j];

        if (attribute.id === productAttribute.attribute_id) {

          newProductAttributesIncludeAttribute.push({
            product_id: productId,
            ...productAttribute,
            attribute: attribute,
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
          attribute: attribute,
        });
      }
    }

    return newProductAttributesIncludeAttribute;
  }

  private async generateAllAttributes(productId: number, typeId: number) {
    if (!Number.isFinite(productId)) {
      throw new Error("productId must be provided");
    }
    if (!Number.isFinite(typeId)) {
      return null;
    }

    await this.deleteAllAttributes(productId);
    const allAttributes = await this.repository.getAttributesByTypeId(typeId);
    const productAttributes: Prisma.product_attributeCreateManyInput[] = [];
    for (let i = 0; i < allAttributes.length; i++) {
      const attribute = allAttributes[i];

      const productAttribute: Prisma.product_attributeCreateManyInput = {
        product_id: productId,
        attribute_id: attribute.id,
        value: ''
      };

      productAttributes.push(productAttribute);
    }

    return this.repository.addProductAttributes(productAttributes);
  }

  private async deleteAllAttributes(productId: number) {
    const productAttributes = await this.repository.findProductAttributesIncludeAttribute(productId);

    const result = await this.repository.deleteProductAttributes(productId);

    for (let i = 0; i < productAttributes.length; i++) {
      const productAttribute = productAttributes[i];

      if (productAttribute.attribute.type === AttributeType.TYPE_FILE
        && productAttribute.value) {
        productAttribute.value = productAttribute.value || '';
        const fileIds = productAttribute.value.split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number);
        this.fileService.deleteMany(fileIds);
      }
    }

    return result;
  }

  private async uploadFiles(productId: number, files: Array<PutObjectWithoutKeyInput> = []) {
    if (!Number.isFinite(productId)) {
      throw new Error('productId must be provided');
    }
    const fileIdsUploaded: number[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const createFileDto: CreateFileDto = {
        discr: FileDiscrimination.PRODUCT_ATTRIBUTE_FILE,
        product_id: productId,
      };

      const afile = await this.fileService.create(createFileDto, {
        ...file,
      });
      fileIdsUploaded.push(afile.id);
    }

    return fileIdsUploaded;
  }

  private async processProductAttributeUpdate(
    productId: number,
    productTypeId: number,
    product_attributes: ProductAttributeDto[] = [],
    typeHasChanged: boolean,
    files: ProductAttributeFile[] = [],
  ): Promise<Prisma.product_attributeUpdateManyWithoutProduct_product_attribute_product_idToproductNestedInput> {
    if (!Number.isFinite(productId)) {
      throw new Error("productId must be provided");
    }
    if (!Number.isFinite(productTypeId)) {
      return null;
    }
    if (product_attributes.length === 0 && files.length === 0) {
      return null;
    }

    // add attribute to body.product_attributes
    // to be able to check the attribute.type
    const attributes =
      await this.repository.getAttributesByProductTypeId(productTypeId);

    const newProductAttributesIncludeAttribute =
      this.addAttributeRelationToProductAttributes(
        productId,
        attributes,
        product_attributes,
      );
      
    const oldProductAttributesIncludeAttribute =
      await this.repository.findProductAttributesIncludeAttribute(productId);

    const oldFileProductAttributes = oldProductAttributesIncludeAttribute
      .filter(product_attribute => product_attribute?.attribute?.type
        === AttributeType.TYPE_FILE);
    const newFileProductAttributes = newProductAttributesIncludeAttribute
      .filter(product_attribute => product_attribute?.attribute?.type
        === AttributeType.TYPE_FILE);

    // the file ids that user just removed them
    const fileIdsDeleteds: Record<string, number[]> = {};
    // the file ids that should be kept
    const fileIdsKepts: Record<string, number[]> = {};

    for (let i = 0; i < oldFileProductAttributes.length; i++) {
      const oldFileProductAttribute = oldFileProductAttributes[i];
      oldFileProductAttribute.value = oldFileProductAttribute.value || '';
      let productAttributeFound = false;

      for (let j = 0; j < newFileProductAttributes.length; j++) {
        const newFileProductAttribute = newFileProductAttributes[j];

        if (oldFileProductAttribute.attribute_id === newFileProductAttribute.attribute_id) {
          // the file ids that must be deleted
          fileIdsDeleteds[oldFileProductAttribute.attribute_id] =
            oldFileProductAttribute.value.split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number).filter(
              (fileId) => !newFileProductAttribute?.value?.split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number).includes(fileId)
            );
          // the file ids that must be kept
          fileIdsKepts[oldFileProductAttribute.attribute_id] =
            oldFileProductAttribute.value.split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number).filter(
              (fileId) => newFileProductAttribute?.value?.split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number).includes(fileId)
            );
          productAttributeFound = true;
          break;
        }
      }

      if (!productAttributeFound) {
        // should be kept beacause the product_attribute was not provided
        fileIdsKepts[oldFileProductAttribute.attribute_id] =
          oldFileProductAttribute.value.split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number);
      }
    }

    // check if the product attributes have not already been deleted
    if (!typeHasChanged) {
      // then delete those files
      for (const fileIdsDeleted of Object.values(fileIdsDeleteds)) {
        if (fileIdsDeleted?.length) {
          this.fileService.deleteMany(fileIdsDeleted);
        }
      }
    }

    // group files by attribute id
    const filesGroupByAttributeId: Record<string, ProductAttributeFile[]> = files.reduce((acc, obj) => {
      const { fieldname } = obj;

      if (!acc[fieldname]) {
        acc[fieldname] = [];
      }
      
      acc[fieldname].push(obj);
      return acc;
    }, {}) || {};

    const uploadedIdsGroupByAttributeId: Record<string, number[]> = {};
    for (const [fileAttributeId, files] of Object.entries(filesGroupByAttributeId)) {
      // upload all new files
      const fileIdsUploaded = await this.uploadFiles(
        productId,
        files.map((file) => ({
          Body: file.buffer,
          ContentType: file.mimetype,
        }))
      );
      // keep all file ids
      uploadedIdsGroupByAttributeId[fileAttributeId] = fileIdsUploaded;
    }

    // get all productAttributes
    const productAttributesIncludeAttributeInclusive =
      this.addAttributeRelationToProductAttributes(
        productId,
        attributes,
        product_attributes,
        true
      );
    
    // store the all file ids to the product_attribute.value in comma-separated format
    for (let i = 0; i < productAttributesIncludeAttributeInclusive.length; i++) {

      if (productAttributesIncludeAttributeInclusive[i].attribute.type === AttributeType.TYPE_FILE) {
        productAttributesIncludeAttributeInclusive[i].value = '';

        for (const [fileAttributeId, fileIds] of Object.entries(fileIdsKepts)) {
          if (productAttributesIncludeAttributeInclusive[i].attribute_id === Number(fileAttributeId)) {
            productAttributesIncludeAttributeInclusive[i].value =
              [...productAttributesIncludeAttributeInclusive[i].value.split(FILE_VALUE_DELIMITER)
                .filter(Boolean).map(Number), ...fileIds].filter(Boolean).join(FILE_VALUE_DELIMITER);
            break;
          }
        }

        for (const [fileAttributeId, fileIds] of Object.entries(uploadedIdsGroupByAttributeId)) {
          if (productAttributesIncludeAttributeInclusive[i].attribute_id === Number(fileAttributeId)) {
            productAttributesIncludeAttributeInclusive[i].value =
              [...productAttributesIncludeAttributeInclusive[i].value.split(FILE_VALUE_DELIMITER)
                .filter(Boolean).map(Number), ...fileIds].filter(Boolean).join(FILE_VALUE_DELIMITER);
            break;
          }
        }
      }

    }

    const productAttributeUpdate: Prisma.product_attributeUpdateManyWithoutProduct_product_attribute_product_idToproductNestedInput = {
      upsert: productAttributesIncludeAttributeInclusive.map(
        newProductAttributeIncludeAttribute => ({
          where: {
            product_id_attribute_id: {
              attribute_id: newProductAttributeIncludeAttribute.attribute_id,
              product_id: newProductAttributeIncludeAttribute.product_id
            },
          },
          update: {
            value: newProductAttributeIncludeAttribute.value,
          },
          create: {
            attribute_id: newProductAttributeIncludeAttribute.attribute_id,
            value: newProductAttributeIncludeAttribute.value,
          },
        })),
    };
    
    return productAttributeUpdate;
  }
}
