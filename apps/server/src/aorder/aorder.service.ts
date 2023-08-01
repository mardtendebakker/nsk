import { AOrderRepository } from './aorder.repository';
import { CreateAOrderDto } from './dto/create-aorder.dto';
import { UpdateAOrderDto } from './dto/update-aorder.dto';
import { AOrderDiscrimination } from './types/aorder-discrimination.enum';
import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateManyAOrderDto } from './dto/update-many-aorder.dto';
import { AOrderProcess } from './aorder.process';
import { PrintService } from '../print/print.service';
import { CompanyDiscrimination } from '../company/types/company-discrimination.enum';
type CommonAOrderDto = Partial<Omit<CreateAOrderDto, 'pickup'>>;
type CommonAOrderInput = Partial<Omit<Prisma.aorderCreateInput, 'pickup'>>;

export class AOrderService {
  constructor(
    protected readonly repository: AOrderRepository,
    protected readonly printService: PrintService,
    protected readonly type?: AOrderDiscrimination
  ) {}

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

    if (this.type !== AOrderDiscrimination.SALE) {
      select = {
        ...select,
        acompany_aorder_supplier_idToacompany: {
          select: companySelect,
        },
      };
    }
    if (this.type !== AOrderDiscrimination.PURCHASE) {
      select = {
        ...select,
        acompany_aorder_customer_idToacompany: {
          select: companySelect,
        },
      };
    }

    const where: Prisma.aorderWhereInput = {
      ...query.where,
      ...(this.type && { discr: this.type }),
      ...(query.search && { order_nr: { contains: query.search } }),
      ...(query.status && { status_id: { equals: query.status } })
    };

    if (query.partner !== undefined) {
      if (this.type !== AOrderDiscrimination.SALE) {
        where.acompany_aorder_supplier_idToacompany = {
          partner_id: query.partner,
        };
      }
      if (this.type !== AOrderDiscrimination.PURCHASE) {
        where.acompany_aorder_customer_idToacompany = {
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

    const orderBy: Prisma.Enumerable<Prisma.aorderOrderByWithRelationInput> =
      !Object.keys(query?.orderBy).length ? { id: 'desc' } : query.orderBy;

    return this.repository.findAll({
      ...query,
      where,
      select,
      orderBy,
    });
  }

  async findOne(id: number) {
    const params: Prisma.aorderFindUniqueArgs = {
      where: { id }
    };

    return this.repository.findOne(this.processSelectPart(params));
  }

  async create(orderDto: CreateAOrderDto) {
    if (this.type === undefined) {
      throw new Error('discr is mandatory!');
    }

    const {
      pickup
    } = orderDto;

    const params: Prisma.aorderCreateArgs = {
      data: {
        ...this.processCreateOrUpdateOrderInput(orderDto),
        order_nr: orderDto.order_nr || 'TEMP' + Math.floor(Date.now() / 1000).toString(),
        discr: this.type,
        order_date: new Date(),
        ...(pickup && { pickup: { create: { ...pickup } } }),
      }
    };

    const aorder = await this.repository.create(this.processSelectPart(params));

    if (orderDto.order_nr === undefined) {
      const {
        id,
        order_date,
      } = aorder;

      const order_nr = order_date.getFullYear() + id.toString().padStart(6, "0");

      try {
        await this.repository.update({
          where: { id },
          data: { order_nr },
        });
        aorder.order_nr = order_nr;
      } catch (e) {
        this.repository.deleteMany([id]);
        throw e;
      }
    }

    return aorder;
  }

  async update(id: number, orderDto: UpdateAOrderDto) {
    const {
      pickup
    } = orderDto;

    const data: Prisma.aorderUpdateInput = {
      ...this.processCreateOrUpdateOrderInput(orderDto),
      ...(pickup && { pickup: { upsert: { update: { ...pickup }, create: { ...pickup } } } }),
    };

    const params: Prisma.aorderUpdateArgs = {
      data: data,
      where: { id }
    };

    return this.repository.update(this.processSelectPart(params));
  }

  async updateMany(updateManyOrderDto: UpdateManyAOrderDto) {
    return this.repository.updateMany({
      data: updateManyOrderDto.order,
      where: {
        id: { in: updateManyOrderDto.ids }
      }
    });
  }

  async deleteOne(id: number) {
    return this.repository.deleteOne(id);
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

    if (this.type !== AOrderDiscrimination.SALE) {
      select = {
        ...select,
        acompany_aorder_supplier_idToacompany: {
          select: companySelect,
        },
      };
    }
    if (this.type !== AOrderDiscrimination.PURCHASE) {
      select = {
        ...select,
        acompany_aorder_customer_idToacompany: {
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

  private processCreateOrUpdateOrderInput(orderDto: CommonAOrderDto): CommonAOrderInput {
    const {
      status_id,
      supplier_id,
      supplier,
      customer_id,
      customer,
      ...rest
    } = orderDto;

    const data: CommonAOrderInput = {
      ...rest,
      ...(status_id && { order_status: { connect: { id: status_id } } }),
      ...(supplier_id && { acompany_aorder_supplier_idToacompany: { connect: { id: supplier_id } } }),
      ...(supplier && { acompany_aorder_supplier_idToacompany: { create: { ...supplier, discr: CompanyDiscrimination.SUPLLIER } } }),
      ...(customer_id && { acompany_aorder_customer_idToacompany: { connect: { id: customer_id } } }),
      ...(customer && { acompany_aorder_customer_idToacompany: { create: { ...customer, discr: CompanyDiscrimination.CUSTOMER } } }),
    };

    return data;
  }

  private processSelectPart<T extends Prisma.aorderArgs>(params: T): T {
    if (this.type === AOrderDiscrimination.PURCHASE) {
      params.include = {
        pickup: {
          include: {
            afile: {
              select: {
                id: true,
                unique_server_filename: true,
                original_client_filename: true,
                discr: true,
              },
            },
          },
        },
      };
    } else if (this.type === AOrderDiscrimination.SALE) {
      params.include = {
        afile: {
          select: {
            id: true,
            unique_server_filename: true,
            original_client_filename: true,
            discr: true,
          },
        },
      };
    }

    return params;
  }
}
