import { Prisma } from "@prisma/client";
import { FindManyDto } from "../common/dto/find-many.dto";
import { FindOneDto } from "../common/dto/find-one.dto";
import { LocationService } from "../location/location.service";
import { StockRepository } from "./stock.repository";
import { ServiceStatus } from "../service/enum/service-status.enum";
import { StockProcess } from "./stock.process";
import { UpdateOneDto } from "../common/dto/update-one.dto";
import { FindStockProcess } from "./find-stock.process";
import { UpdateManyProductDto } from "./dto/update-many-product.dto";

export class StockService {
  constructor(
    protected readonly repository: StockRepository,
    protected readonly locationService: LocationService
  ) {}

  async findAll(query: FindManyDto) {
    const productTypeSelect: Prisma.product_typeSelect = {
      name: true,
      _count: {
        select: {
          product_type_task: true,
        }
      }
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
      repair: {
        select: repairSelect,
      }
    };

    const serviceSelect: Prisma.aserviceSelect = {
      id: true,
    };

    const serviceDoneWhere: Prisma.aserviceWhereInput = {
      status: ServiceStatus.STATUS_DONE,
    };

    const productOrderSelect: Prisma.product_orderSelect = {
      quantity: true,
      aorder: {
        select: aorderSelect,
      },
      aservice: {
        select: serviceSelect,
        where: serviceDoneWhere,
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
    };
    const productStatusSelect: Prisma.product_statusSelect = {
      id: true,
    }
    const attributeOptionSelect: Prisma.attribute_optionSelect = {
      id: true,
      name: true,
      price: true
    };
    const attributeSelect: Prisma.attributeSelect = {
      id: true,
      name: true,
      type: true,
      has_quantity: true,
      attribute_option: {
        select: attributeOptionSelect
      },
    };
    const productTypeAttributeSelect: Prisma.product_type_attributeSelect = {
      attribute: {
        select: attributeSelect,
      },
    };
    const productTypeSelect: Prisma.product_typeSelect = {
      id: true,
      product_type_attribute: {
        select: productTypeAttributeSelect,
      },
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
      aorder: {
        select: aorderSelect,
      },
    };
    const afileSelect: Prisma.afileSelect = {
      unique_server_filename: true,
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

    const productPromise = this.repository.findOne({ ...query, select: productSelect });
    const locationsPromise = this.locationService.getAll();
    const product_statusesPromise = this.repository.getAllStatus();
    const product_typesPromise = this.repository.getAllTypes();
    
    const product = await productPromise;
    const locations = await locationsPromise;
    const product_statuses = await product_statusesPromise;
    const product_types = await product_typesPromise;

    return new FindStockProcess(
      product,
      locations,
      product_statuses,
      product_types
    ).run();
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
