import { Prisma } from "@prisma/client";
import { FindOneDto } from "../common/dto/find-one.dto";
import { LocationService } from "../location/location.service";
import { StockRepository } from "./stock.repository";
import { ProductAttributeIncludeAttributeGetPayload, ProductRelationGetPayload, StockProcess } from "./stock.process";
import { UpdateManyProductDto } from "./dto/update-many-product.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { ProductAttributeUpdateDto, UpdateBodyStockDto } from "./dto/update-body-stock.dto";
import { FileService } from "../file/file.service";
import { FileDiscrimination } from "../file/types/file-discrimination.enum";
import { CreateFileDto } from "../file/dto/upload-meta.dto";
import { AttributeType } from "../attribute/enum/attribute-type.enum";

const FILE_VALUE_DELIMITER = ',';

export class StockService {
  constructor(
    protected readonly repository: StockRepository,
    protected readonly locationService: LocationService,
    protected readonly fileService: FileService
  ) {}

  async findAll(query: FindManyDto) {
    const productTypeTaskSelect: Prisma.product_type_taskSelect = {
      task: true,
    };

    const productTypeSelect: Prisma.product_typeSelect = {
      name: true,
      product_type_task: {
        select: productTypeTaskSelect
      },
    };

    const locationSelect: Prisma.locationSelect = {
      name: true,
    };

    const repairSelect: Prisma.repairSelect = {
      id: true,
    };

    const aorderSelect: Prisma.aorderSelect = {
      discr: true,
      order_date: true,
      order_nr: true,
      repair: {
        select: repairSelect,
      }
    };

    const serviceSelect: Prisma.aserviceSelect = {
      id: true,
      task_id: true,
      status: true,
    };

    const productOrderSelect: Prisma.product_orderSelect = {
      quantity: true,
      price: true,
      aorder: {
        select: aorderSelect,
      },
      aservice: {
        select: serviceSelect,
      }
    };

    const productStatusSelect: Prisma.product_statusSelect = {
      id: true,
      name: true,
      is_stock: true,
      is_saleable: true,
    };

    const attributeSelect: Prisma.attributeSelect = {
      type: true,
      has_quantity: true,
    };

    const ParrentProductSelect: Prisma.productSelect = {
      id: true,
    };

    const productAttributedSelect: Prisma.product_attributeSelect = {
      quantity: true,
      product_product_attribute_product_idToproduct: {
        select: ParrentProductSelect,
      },
      attribute: {
        select: attributeSelect,
      },
    };

    const productSelect: Prisma.productSelect = {
      ...query.select,
      id: true,
      sku: true,
      name: true,
      product_type: {
        select: productTypeSelect,
      },
      location: {
        select: locationSelect,
      },
      price: true,
      product_order: {
        select: productOrderSelect,
      },
      product_status: {
        select: productStatusSelect,
      },
      product_attribute_product_attribute_value_product_idToproduct: {
        select: productAttributedSelect,
      },
      created_at: true,
      updated_at: true
    };

    // const isStock = product_status ? product_status?.is_stock ?? true : true;
    // this where is the top line logic transformation
    const productwhere: Prisma.productWhereInput = {
      ...query.where,
      ...(query.orderId && { product_order: { some: { order_id: query.orderId } } }),
      ...(query.search && { name: { contains: query.search } }),
      ...(query.productType && { type_id: query.productType }),
      ...(query.location && { location_id: query.location }),
      OR: [{
        status_id: null,
      }, {
        product_status: {
          ...(query.productStatus && { id: query.productStatus }),
          OR: [{
            is_stock: null
          }, {
            is_stock: true
          }]
        }
      }]
    }

    const productOrderBy: Prisma.productOrderByWithRelationInput[] = query.orderBy || [
      {
        id: 'desc',
      },
    ];

    const result = await this.repository.findAll({
      ...query,
      select: productSelect,
      where: productwhere,
      orderBy: productOrderBy,
    });

    const data = await Promise.all(result.data.map(async product => {
      const productProcess = new StockProcess(this.repository, product, productSelect);
      return productProcess.run();
    }));

    return {
      count: result.count,
      data: data//.filter(d => d.stock != 0) // TODO: the out of stock products should be removed by cron job not here by filtering
    };
  }

  async findOne(query: FindOneDto) {
    const locationSelect: Prisma.locationSelect = {
      id: true,
      name: true,
    };
    const productStatusSelect: Prisma.product_statusSelect = {
      id: true,
      name: true,
    }
    const productTypeSelect: Prisma.product_typeSelect = {
      id: true,
      name: true,
    };
    const acompanySelect: Prisma.acompanySelect = {
      name: true,
    };
    const orderStatus: Prisma.order_statusSelect = {
      name: true,
    };
    const aorderSelect: Prisma.aorderSelect = {
      id: true,
      order_nr: true,
      order_date: true,
      acompany_aorder_customer_idToacompany: {
        select: acompanySelect,
      },
      acompany_aorder_supplier_idToacompany: {
        select: acompanySelect,
      },
      order_status: {
        select: orderStatus,
      },
    };
    const productOrderSelect: Prisma.product_orderSelect = {
      quantity: true,
      price: true,
      aorder: {
        select: aorderSelect,
      },
    };
    const afileSelect: Prisma.afileSelect = {
      id: true,
      unique_server_filename: true,
      original_client_filename: true,
      discr: true,
    };
    const attributeSelect: Prisma.attributeSelect = {
      type: true,
    };
    const productAttributeSelect: Prisma.product_attributeSelect = {
      quantity: true,
      value: true,
      attribute_id: true,
      attribute: {
        select: attributeSelect
      }
    };
    const productSelect: Prisma.productSelect = {
      id: true,
      sku: true,
      name: true,
      price: true,
      created_at: true,
      updated_at: true,
      description: true,
      location: {
        select: locationSelect
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
      afile: {
        select: afileSelect,
      },
      product_attribute_product_attribute_product_idToproduct: {
        select: productAttributeSelect
      },
    };

    const {
      product_attribute_product_attribute_product_idToproduct,
      ...rest
    } = await <Promise<ProductRelationGetPayload>>this.repository.findOne({ ...query, select: productSelect });

    return {
      ...rest,
      product_attributes: product_attribute_product_attribute_product_idToproduct,
    }
  }

  async updateOne(id: number, body: UpdateBodyStockDto, files: Express.Multer.File[]) {
    const stock = await this.findOne({ where: { id } });

    const typeHasChanged = body.type_id !== undefined && body.type_id !== stock.product_type.id;

    // check if the product type has changed
    if (typeHasChanged) {
      // generate a new set of product attributes
      await this.generateAllAttributes(id, body.type_id);
    }

    const { product_attributes, ...restBody } = body;

    const productAttributeUpdate = await this.processProductAttributeUpdate(
      id,
      product_attributes,
      files,
      typeHasChanged
    );

    return this.repository.updateOne({
      where: { id },
      data: {
        ...restBody,
        ...(productAttributeUpdate && {
          product_attribute_product_attribute_product_idToproduct: productAttributeUpdate
        }),
      },
    });
  }

  async deleteMany(ids: number[]) {
    return this.repository.deleteMany(ids);
  }

  async updateMany(updateManyProductDto: UpdateManyProductDto) {
    return this.repository.updateMany({
      data: updateManyProductDto.product,
      where: {
        id: { in: updateManyProductDto.ids }
      }
    });
  }

  async deleteAllAttributes(productId: number) {
    const productAttributes = await this.repository.findProductAttributesIncludeAttribute(productId);

    const result = await this.repository.deleteProductAttributes(productId);

    for (let i = 0; i < productAttributes.length; i++) {
      const productAttribute = productAttributes[i];

      if (productAttribute.attribute.type === AttributeType.TYPE_FILE
        && productAttribute.value !== '') {
        const fileIds = productAttribute.value.split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number);
        this.fileService.deleteMany(fileIds);
      }
    }

    return result;
  }

  async generateAllAttributes(productId: number, typeId: number) {
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

  async uploadFiles(productId: number, files: Express.Multer.File[] = []) {
    if (productId === undefined) {
      throw new Error('productId must be provided');
    }
    const fileIdsUploaded: number[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const createFileDto: CreateFileDto = {
        discr: FileDiscrimination.PRODUCT_ATTRIBUTE_FILE,
        product_id: productId,
      };

      const afile = await this.fileService.create(createFileDto, file);
      fileIdsUploaded.push(afile.id);
    }

    return fileIdsUploaded;
  }

  private addAttributeRelationToProductAttributes(
    productId: number,
    productAttributes: ProductAttributeUpdateDto[],
    includeAttributes: ProductAttributeIncludeAttributeGetPayload[],
  ): ProductAttributeIncludeAttributeGetPayload[] {

    const newProductAttributesIncludeAttribute:
      ProductAttributeIncludeAttributeGetPayload[] = [];

    for (let i = 0; i < productAttributes.length; i++) {
      const productAttributeBody = productAttributes[i];

      for (let j = 0; j < includeAttributes.length; j++) {
        const includeAttribute =
          includeAttributes[j];

        if (productAttributeBody.attribute_id
          === includeAttribute.attribute_id) {

          newProductAttributesIncludeAttribute.push({
            product_id: productId,
            ...productAttributeBody,
            attribute: includeAttribute.attribute,
          });

        }
      }
    }

    return newProductAttributesIncludeAttribute;
  }

  private async processProductAttributeUpdate(
    productId: number,
    product_attributes: ProductAttributeUpdateDto[] = [],
    files: Express.Multer.File[],
    typeHasChanged: boolean,
  ): Promise<Prisma.product_attributeUpdateManyWithoutProduct_product_attribute_product_idToproductNestedInput> {

    if (productId === undefined) {
      throw new Error("productId must be provided");
    }
    if (product_attributes.length === 0 && files.length === 0) {
      return null;
    }

    // add attribute to body.product_attributes
    // to be able to check the attribute.type
    const productAttributesIncludeAttribute =
      await this.repository.findProductAttributesIncludeAttribute(productId);

    const newProductAttributesIncludeAttribute =
      this.addAttributeRelationToProductAttributes(
        productId,
        product_attributes,
        productAttributesIncludeAttribute
      );

    const oldFileProductAttributes = productAttributesIncludeAttribute
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
      let productAttributeFound = false;

      for (let j = 0; j < newFileProductAttributes.length; j++) {
        const newFileProductAttribute = newFileProductAttributes[j];

        if (oldFileProductAttribute.attribute_id === newFileProductAttribute.attribute_id) {
          // the file ids that must be deleted
          fileIdsDeleteds[oldFileProductAttribute.attribute_id] =
            oldFileProductAttribute?.value.split(FILE_VALUE_DELIMITER).filter(Boolean).map(Number).filter(
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

    // join fileIdsCommon and fileIdsUploaded and 
    const filesGroupByAttributeId: Record<string, Express.Multer.File[]> = files.reduce((acc, obj) => {
      const { fieldname } = obj;
      if (!acc[fieldname]) {
        acc[fieldname] = [];
      }
      acc[fieldname].push(obj);
      return acc;
    }, {});

    const uploadedIdsGroupByAttributeId: Record<string, number[]> = {};
    for (const [fileAttributeId, files] of Object.entries(filesGroupByAttributeId)) {
      // upload all new files
      const fileIdsUploaded = await this.uploadFiles(productId, files);
      // keep all file ids
      uploadedIdsGroupByAttributeId[fileAttributeId] = fileIdsUploaded;
    }

    // merge fileIdsKepts and uploadedIdsGroupByAttributeId
    const mergedFileIds: Record<string, number[]> = Object.entries(fileIdsKepts).reduce(
      (result, [key, value]) => {
        result[key] = value.concat(uploadedIdsGroupByAttributeId[key] || []);
        return result;
      },
      { ...fileIdsKepts }
    );

    // store the merged file ids to the product_attribute.value in comma-separated format
    for (const [fileAttributeId, fileIds] of Object.entries(mergedFileIds)) {
      let productAttributeFound = false;
      for (let i = 0; i < newProductAttributesIncludeAttribute.length; i++) {
        if (newProductAttributesIncludeAttribute[i].attribute_id === Number(fileAttributeId)) {
          newProductAttributesIncludeAttribute[i].value = fileIds.filter(Boolean).join(FILE_VALUE_DELIMITER);
          productAttributeFound = true;
          break;
        }
      }
      if (!productAttributeFound) {
        newProductAttributesIncludeAttribute.push({
          product_id: productId,
          attribute_id: Number(fileAttributeId),
          value: fileIds.filter(Boolean).join(FILE_VALUE_DELIMITER),
          value_product_id: null,
          quantity: null,
          external_id: null
        });
      }
    }

    const productAttributeUpdate: Prisma.product_attributeUpdateManyWithoutProduct_product_attribute_product_idToproductNestedInput = {
      update: newProductAttributesIncludeAttribute.map(
        newProductAttributeIncludeAttribute => ({
          where: {
            product_id_attribute_id: {
              attribute_id: newProductAttributeIncludeAttribute.attribute_id,
              product_id: newProductAttributeIncludeAttribute.product_id
            },
          },
          data: {
            value: newProductAttributeIncludeAttribute.value
          },
        })),
    }

    return productAttributeUpdate;
  }
}
