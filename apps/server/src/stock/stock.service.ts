import { Prisma } from "@prisma/client";
import { FindOneDto } from "../common/dto/find-one.dto";
import { LocationService } from "../location/location.service";
import { StockRepository } from "./stock.repository";
import { StockProcess } from "./stock.process";
import { UpdateOneDto } from "../common/dto/update-one.dto";
import { UpdateManyProductDto } from "./dto/update-many-product.dto";
import { FindManyDto } from "./dto/find-many.dto";

export class StockService {
  constructor(
    protected readonly repository: StockRepository,
    protected readonly locationService: LocationService
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
    } = await this.repository.findOne({ ...query, select: productSelect });

    return {
      ...rest,
      product_attributes: product_attribute_product_attribute_product_idToproduct,
    }
  }

  updateOne(params: UpdateOneDto) {
    const { where, data }  = params;
    return this.repository.updateOne({
      where,
      data
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
}
