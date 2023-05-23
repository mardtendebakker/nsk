import { AOrderRepository } from './aorder.repository';
import { CreateAOrderDto } from './dto/create-aorder.dto';
import { UpdateAOrderDto } from './dto/update-aorder.dto';
import { AOrderDiscrimination } from './types/aorder-discrimination.enum';
import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateManyAOrderDto } from './dto/update-many-aorder.dto';
import { AOrderProcess } from './aorder.process';
import { PrintService } from '../print/print.service';
import { GroupBy } from './types/group-by.enum';
import { ProductAnalyticsResultDto } from './dto/product-analytics-result.dto';

export class AOrderService {
  constructor(
    protected readonly repository: AOrderRepository,
    protected readonly printService: PrintService,
    protected readonly type: AOrderDiscrimination
  ) {}

  async getAOrders(order_nr: string) {
    const aorders = await this.repository.getAOrders({
      where: {
        order_nr
      },
      select: {
        id: true,
        order_nr: true,
        order_date: true,
        acompany_aorder_supplier_idToacompany: {
          select: {
            name: true,
          },
        },
      },
    });

    return aorders.map(aorder => {
      const { acompany_aorder_supplier_idToacompany, ...rest } = aorder;
      return {
        ...rest,
        company_name: acompany_aorder_supplier_idToacompany?.name || '',
      };
    });
  }

  async findAll(query: FindManyDto) {
    const companySelect: Prisma.acompanySelect = {
      name: true,
      acompany: {
        select: {
          id: true,
          name: true,
        }
      }
    };

    let select: Prisma.aorderSelect = {
      id: true,
      order_nr: true,
      order_date: true,
      order_status: {
        select: {
          id: true,
          name: true,
          color: true,
        }
      },
    };

    if (this.type === AOrderDiscrimination.SALE) {
      select = {
        ...select,
        acompany_aorder_customer_idToacompany: {
          select: companySelect,
        },
      };
    } else if (this.type === AOrderDiscrimination.PURCHASE) {
      select = {
        ...select,
        acompany_aorder_supplier_idToacompany: {
          select: companySelect,
        },
      };
    }

    const where = {
      ...query.where,
      discr: this.type,
      ...(query.search && { order_nr: { contains: query.search } }),
      ...(query.status && { status_id: { equals: query.status } })
    };

    if (query.partner !== undefined) {
      if (this.type === AOrderDiscrimination.PURCHASE) {
        where.acompany_aorder_customer_idToacompany = {
          partner_id: query.partner,
        };
      } else if (this.type === AOrderDiscrimination.SALE) {
        where.acompany_aorder_supplier_idToacompany = {
          partner_id: query.partner,
        };
      }
    }

    if (query.createdBy !== undefined) {
      where.OR = [
        {
          acompany_aorder_customer_idToacompany: {
            id: query.createdBy,
          },
        },
        {
          acompany_aorder_supplier_idToacompany: {
            id: query.createdBy,
          },
        },
      ];
    }

    return this.repository.findAll({
      ...query,
      where,
      select,
      orderBy: query.orderBy,
    });
  }

  async create(comapny: CreateAOrderDto) {
    return this.repository.create({
      ...comapny,
      discr: this.type
    });
  }

  async findOne(id: number) {
    return this.repository.findOne({ id });
  }

  async update(id: number, comapny: UpdateAOrderDto) {
    return this.repository.update({
      data: comapny,
      where: { id }
    });
  }

  async updateMany(updateManyOrderDto: UpdateManyAOrderDto) {
    return this.repository.updateMany({
      data: updateManyOrderDto.order,
      where: {
        id: { in: updateManyOrderDto.ids }
      }
    });
  }

  async deleteMany(ids: number[]) {
    return this.repository.deleteMany(ids);
  }

  async findByIds(ids: number[]) {
    const productSelect: Prisma.productSelect = {
      sku: true,
      name: true,
      product_type: {
        select: {
          name: true
        }
      },
    };

    const serviceSelect: Prisma.aserviceSelect = {
      status: true,
      price: true
    };

    const productOrderSelect: Prisma.product_orderSelect = {
      quantity: true,
      price: true,
      product: {
        select: productSelect,
      },
      aservice: {
        select: serviceSelect,
      }
    };

    const companySelect: Prisma.acompanySelect = {
      name: true,
      kvk_nr: true,
      representative: true,
      email: true,
      phone: true,
      street: true,
      street_extra: true,
      city: true,
      zip: true,
      state: true,
      country: true,
    };

    const fileSelect: Prisma.afileSelect = {
      original_client_filename: true,
    }

    const pickupSelect: Prisma.pickupSelect = {
      real_pickup_date: true,
      description: true,
      data_destruction: true,
      afile: {
        select: fileSelect
      },
    };

    let select: Prisma.aorderSelect = {
      id: true,
      order_nr: true,
      order_date: true,
      remarks: true,
      delivery_type: true,
      delivery_date: true,
      delivery_instructions: true,
      transport: true,
      discount: true,
      is_gift: true,
      order_status: {
        select: {
          id: true,
          name: true,
          color: true,
        }
      },
      product_order: {
        select: productOrderSelect,
      },
      pickup: {
        select: pickupSelect
      }
    };

    if (this.type === AOrderDiscrimination.SALE) {
      select = {
        ...select,
        acompany_aorder_customer_idToacompany: {
          select: companySelect,
        },
      };
    } else if (this.type === AOrderDiscrimination.PURCHASE) {
      select = {
        ...select,
        acompany_aorder_supplier_idToacompany: {
          select: companySelect,
        },
      };
    }

    const where: Prisma.aorderWhereInput = {
      id: { in: ids },
    };

    const result = await this.repository.findBy({
      where,
      select,
      orderBy: { id: 'asc', },
    });

    return result.map(aorder => {
      const aorderProcess = new AOrderProcess(aorder);
      return aorderProcess.run();
    });;
  }

  async printAOrders(ids: number[]) {
    const aorders = await this.findByIds(ids);
    return this.printService.printAOrders(aorders);
  }

  async productAnalytics(groupBy: GroupBy): Promise<ProductAnalyticsResultDto> {
    return this.repository.productAnalytics(this.type, groupBy);
  }
}
