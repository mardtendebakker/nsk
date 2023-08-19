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
import { FileService } from '../file/file.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
type CommonAOrderDto = Partial<Omit<CreateAOrderDto, 'pickup' | 'repair'>>;
type CommonAOrderInput = Partial<Omit<Prisma.aorderCreateInput, 'pickup' | 'repair'>>;

export class AOrderService {
  constructor(
    protected readonly repository: AOrderRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
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
      ...(query.status && { status_id: { equals: query.status } }),
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
      Object.keys(query?.orderBy || {})?.length ? query.orderBy : { id: 'desc' };

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

    const order = await this.repository.findOne(this.processSelectPart(params));

    if (!order || order?.discr !== this.type) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    return new AOrderProcess(order).run();;
  }

  async create(orderDto: CreateAOrderDto) {
    if (this.type === undefined) {
      throw new BadRequestException('The operation requires a specific order type');
    }

    const { pickup, repair } = orderDto;

    const params: Prisma.aorderCreateArgs = {
      data: {
        ...this.processCreateOrUpdateOrderInput(orderDto),
        order_nr: orderDto.order_nr || 'TEMP' + Math.floor(Date.now() / 1000).toString(),
        discr: this.type,
        order_date: new Date(),
        ...(pickup && { pickup: { create: { ...pickup } } }),
        ...(repair && { repair: { create: { ...repair } } })
      }
    };

    const aorder = await this.repository.create(this.processSelectPart(params));

    if (orderDto.order_nr === undefined) {
      const { id, order_date } = aorder;

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
    const { pickup, repair } = orderDto;

    const data: Prisma.aorderUpdateInput = {
      ...this.processCreateOrUpdateOrderInput(orderDto),
      ...(pickup && { pickup: { upsert: { update: { ...pickup }, create: { ...pickup } } } }),
      ...(repair && { repair: { upsert: { update: { ...repair }, create: { ...repair } } } }),
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
    const order = await this.findOne(id);
    if (order.discr === AOrderDiscrimination.PURCHASE) {
      order?.pickup?.['afile']?.length &&
        this.fileService.deleteMany(
          order?.pickup?.['afile']?.map((file) => file.id)
        );
    } else if (order.discr === AOrderDiscrimination.SALE) {
      order['afile']?.length &&
        this.fileService.deleteMany(order['afile']?.map((file) => file.id));
    }

    return this.repository.deleteOne(id);
  }
  
  async deleteFiles(id: number, fileIds: number[]) {
    await this.findOne(id);
    
    return this.fileService.deleteMany(fileIds);
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

    return result.map(aorder => new AOrderProcess(aorder).run());
  }

  async printAOrders(ids: number[]) {
    const aorders = await this.findByIds(ids);
    return this.printService.printAOrders(aorders);
  }

  protected processCreateOrUpdateOrderInput(orderDto: CommonAOrderDto): CommonAOrderInput {
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

  protected processSelectPart<T extends Prisma.aorderArgs>(params: T): T {
    params.include = {
      ...params.include,
      product_order: {
        select: {
          product_id: true,
          price: true,
          quantity: true,
        }
      }
    };

    if (this.type === AOrderDiscrimination.PURCHASE) {
      params.include = {
        ...params.include,
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
        ...params.include,
        afile: {
          select: {
            id: true,
            unique_server_filename: true,
            original_client_filename: true,
            discr: true,
          },
        },
        repair: true
      };
    }

    return params;
  }
}
