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
import { AOrderProductProcess } from './aorder-product.process';
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
    const {
      search,
      status,
      partner,
      createdBy,
      ...restQuery
    } = query;

    const params: Prisma.aorderFindManyArgs = {
      ...restQuery,
      select: {
        id: true,
        order_nr: true,
        order_date: true,
        product_order: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
        order_status: {
          select: {
            id: true,
            name: true,
            color: true,
          }
        },
        ...(this.type === AOrderDiscrimination.PURCHASE && {
          pickup: {
            select: {
              real_pickup_date: true,
            },
          },
        }),
        delivery_date: true,
        acompany_aorder_supplier_idToacompany: {
          select: this.getCompanySelect(),
        },
        acompany_aorder_customer_idToacompany: {
          select: this.getCompanySelect(),
        },
      },
      where: {
        ...query.where,
        ...(this.type && { discr: this.type }),
        ...(search && { order_nr: { contains: search } }),
        ...(status && { status_id: { equals: status } }),
        ...((createdBy || partner) && {
          OR: [
            {
              acompany_aorder_supplier_idToacompany: {
                ...(createdBy && { id: createdBy }),
                ...(partner && { partner_id: partner }),
              },
            },
            {
              acompany_aorder_customer_idToacompany: {
                ...(createdBy && { id: createdBy }),
                ...(partner && { partner_id: partner }),
              },
            },
          ],
        }),
      },
      orderBy: Object.keys(query?.orderBy || {})?.length ? query.orderBy : { id: 'desc' },
    };

    const result = await this.repository.findAll(params);
    
    return {
      count: result.count,
      data: result.data.map(order => new AOrderProductProcess(order).run()),
    };
  }

  async findOne(id: number) {
    const params: Prisma.aorderFindUniqueArgs = {
      where: { id }
    };

    const order = await this.repository.findOne(this.commonIncludePart(params));

    if (!order || order?.discr !== this.type) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    return new AOrderProcess(order).run();
  }

  async create(aorderDto: CreateAOrderDto) {
    if (this.type === undefined) {
      throw new BadRequestException('The operation requires a specific order type');
    }

    const { pickup, repair, ...commonDto } = aorderDto;

    const params: Prisma.aorderCreateArgs = {
      data: {
        ...this.processCreateOrUpdateOrderInput(commonDto),
        order_nr: commonDto.order_nr || 'TEMP' + Math.floor(Date.now() / 1000).toString(),
        discr: this.type,
        order_date: new Date(),
        ...(pickup && { pickup: { create: { ...pickup } } }),
        ...(repair && { repair: { create: { ...repair } } })
      }
    };

    const order = await this.repository.create(this.commonIncludePart(params));

    if (commonDto.order_nr === undefined) {
      const { id, order_date } = order;

      const order_nr = order_date.getFullYear() + id.toString().padStart(6, "0");

      try {
        await this.repository.update({
          where: { id },
          data: { order_nr },
        });
        order.order_nr = order_nr;
      } catch (e) {
        this.repository.deleteMany([id]);
        throw e;
      }
    }

    return new AOrderProcess(order).run();
  }

  async update(id: number, aorderDto: UpdateAOrderDto) {
    const { pickup, repair, ...commonDto } = aorderDto;

    const data: Prisma.aorderUpdateInput = {
      ...this.processCreateOrUpdateOrderInput(commonDto),
      ...(pickup && { pickup: { upsert: { update: { ...pickup }, create: { ...pickup } } } }),
      ...(repair && { repair: { upsert: { update: { ...repair }, create: { ...repair } } } }),
    };

    const params: Prisma.aorderUpdateArgs = {
      data: data,
      where: { id }
    };

    const order = await this.repository.update(this.commonIncludePart(params));

    return new AOrderProcess(order).run();
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
    const params: Prisma.aorderFindManyArgs = {
      where: {
        id: { in: ids },
      },
      orderBy: { id: 'asc', },
    };

    const result = await this.repository.findBy(this.commonIncludePart(params));

    return result.map(order => new AOrderProcess(order).run());
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

  protected commonIncludePart<T extends Prisma.aorderDefaultArgs>(params: T): T {
    params.include = {
      ...params.include,
      order_status: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      product_order: {
        select: {
          id: true,
          product_id: true,
          price: true,
          quantity: true,
          product: {
            select: {
              sku: true,
              name: true,
              product_type: {
                select: {
                  name: true,
                },
              },
            },
          },
          aservice: {
            select: {
              status: true,
              price: true
            }
          }
        },
      },
    };

    if (this.type !== AOrderDiscrimination.SALE) {
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
        acompany_aorder_supplier_idToacompany: {
          select: this.getCompanySelect()
        },
      };
    }
    
    if (this.type !== AOrderDiscrimination.PURCHASE) {
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
        acompany_aorder_customer_idToacompany: {
          select: this.getCompanySelect()
        },
        repair: true
      };
    }

    return params;
  }

  protected getCompanySelect(): Prisma.acompanySelect {
    return {
      id: true,
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
      acompany: {
        select: {
          id: true,
          name: true,
          street: true,
          city: true,
          zip: true,
        }
      }
    };
  }
}
