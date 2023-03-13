import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FindManyDto } from '../common/dto/find-many.dto';
import { FindOneDto } from '../common/dto/find-one.dto';
import { ServiceStatus } from '../service/enum/service-status.enum';
import { ProductRepository } from './product.repository';
import { ProductProcess } from './product.process';

@Injectable()
export class ProductService {
  constructor(protected readonly repository: ProductRepository) {}

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

    const orderBy: Prisma.productOrderByWithRelationInput[] = [
      {
        id: 'desc',
      },
    ];

    const result = await this.repository.findAll({
      ...query,
      select: productSelect,
      where: productwhere,
      orderBy,
    });

    const data = await Promise.all(result.data.map(async product => {
      const productProcess = new ProductProcess(this.repository, product, productSelect);
      return productProcess.run();
    }));

    return {
      count: result.count,
      data: data//.filter(d => d.stock != 0)
    };
  }

  async findOne(query: FindOneDto) {
    return this.repository.findOne({ ...query });
  }
}
