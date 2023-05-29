import { Prisma } from "@prisma/client";
import { FindOneDto } from "../common/dto/find-one.dto";
import { LocationService } from "../location/location.service";
import { StockRepository } from "./stock.repository";
import { ProductRelationGetPayload, StockProcess } from "./stock.process";
import { UpdateManyProductDto } from "./dto/update-many-product.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { UpdateBodyStockDto } from "./dto/update-body-stock.dto";
import { FileService } from "../file/file.service";
import { FileDiscrimination } from "../file/types/file-discrimination.enum";
import { CreateFileDto } from "../file/dto/upload-meta.dto";

const FILE_VALUE_SEPARATOR = ',';
const FILE_ATTRIBUTE_ID = 15;

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
      ...(query.orderId && {product_order: {some: {order_id: query.orderId}}}),
      ...(query.search && {name: {contains: query.search}}),
      ...(query.productType && {type_id: query.productType}),
      ...(query.location && {location_id: query.location}),
      OR: [{
        status_id: null,
      }, {
        product_status: {
          ...(query.productStatus && {id: query.productStatus}),
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
      unique_server_filename: true,
      original_client_filename: true,
    };
    const productAttributeSelect: Prisma.product_attributeSelect = {
      quantity: true,
      value: true,
      attribute_id: true,
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

  async updateOne(id: number, body: UpdateBodyStockDto, images: Express.Multer.File[]) {
    const stock = await this.findOne({ where: { id } });
    const old_photo_attribute = stock.product_attributes.find(product_attribute => product_attribute.attribute_id === FILE_ATTRIBUTE_ID);
    const new_photo_attribute = body.product_attributes.find(product_attribute => product_attribute.attribute_id === FILE_ATTRIBUTE_ID);
    const fileIdsOldUnique: number[] = old_photo_attribute.value.split(FILE_VALUE_SEPARATOR).map(Number).filter(
      (fileId) => !new_photo_attribute.value.split(FILE_VALUE_SEPARATOR).map(Number).includes(fileId)
    );
    const fileIdsCommon: number[] = old_photo_attribute.value.split(FILE_VALUE_SEPARATOR).map(Number).filter(
      (num) => new_photo_attribute.value.split(FILE_VALUE_SEPARATOR).map(Number).includes(num)
    );

    /**
     * check if the product type has changed
     */
    if (body.type_id !== undefined && body.type_id !== stock.product_type.id) {
      /**
       * delete all product_attribute by product_id
       * since we need a new set of product attributes
       */
      this.deleteAllAttributes(id);
    } else {
      /**
       * otherwise check if user removes some photo
       * then delete those photos
       */
      if (fileIdsOldUnique.length) {
        this.fileService.deleteMany(fileIdsOldUnique);
      }
    }

    /**
     * upload all new images
     */
    const fileIdsUploaded: number[] = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const createFileDto: CreateFileDto = {
        discr: FileDiscrimination.PRODUCT_ATTRIBUTE_FILE,
        product_id: id,
      };
      
      const file = await this.fileService.create(createFileDto, image);
      fileIdsUploaded.push(file.id);
    }

    /**
     * join fileIdsCommon and fileIdsUploaded and store them
     * to the product_attribute value in comma-separated format
     */
    for (let i = 0; i < body.product_attributes.length; i++) {
      if (body.product_attributes[i].attribute_id === FILE_ATTRIBUTE_ID) {
        body.product_attributes[i].value = [...fileIdsCommon, ...fileIdsUploaded].join(FILE_VALUE_SEPARATOR);
      }
    }
    
    return this.repository.updateOne({
      where: { id },
      data: body,
    });
  }

  async deleteMany(ids: number[]) {
    return this.repository.deleteMany(ids);
  }

  async updateMany(updateManyProductDto: UpdateManyProductDto) {
    return this.repository.updateMany({
      data: updateManyProductDto.product,
      where: { 
        id: {in: updateManyProductDto.ids}
       }
    });
  }

  async deleteAllAttributes(productId: number) {
    const include: Prisma.product_attributeInclude = {
      attribute: true
    };

    const productAttributes = await this.repository.findProductAttributes(productId, include);

    const result = await this.repository.deleteAttributes(productId);

    for (let i = 0; i < productAttributes.length; i++) {
      const productAttribute = productAttributes[i];
      if (productAttribute.attribute.id === FILE_ATTRIBUTE_ID) {
        const fileIds = productAttribute.value.split(FILE_VALUE_SEPARATOR).map(Number);
        this.fileService.deleteMany(fileIds);
      }
    }
    
    return result;
  }
}
