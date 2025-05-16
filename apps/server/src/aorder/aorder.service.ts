import { afile, Prisma } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AOrderRepository } from './aorder.repository';
import { CreateAOrderDto } from './dto/create-aorder.dto';
import { UpdateAOrderDto } from './dto/update-aorder.dto';
import { AOrderDiscrimination } from './types/aorder-discrimination.enum';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateManyAOrderDto } from './dto/update-many-aorder.dto';
import { AOrderProcess } from './aorder.process';
import { PrintService } from '../print/print.service';
import { FileService } from '../file/file.service';
import { AOrderProductProcess } from './aorder-product.process';
import { ContactService } from '../contact/contact.service';
import { AOrderPayloadRelation } from './types/aorder-payload-relation';
import { AOrderFindManyReturnType } from './types/aorder-find-many-return-type';
import { VAT_CODES } from '../company/const/vat-code';
import { FileDiscrimination } from '../file/types/file-discrimination.enum';
import { CreateFileDto } from '../file/dto/create-file.dto';

type CommonAOrderDto = Partial<Omit<CreateAOrderDto, 'pickup' | 'repair'>>;
type CommonAOrderInput = Partial<Omit<Prisma.aorderCreateInput, 'pickup' | 'repair' | 'delivery'>>;

export class AOrderService {
  constructor(
    protected readonly repository: AOrderRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
    protected readonly contactService: ContactService,
    protected readonly type?: AOrderDiscrimination,
  ) {}

  async findAll(query: FindManyDto, email?: string) {
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
          },
        },
        ...(this.type === AOrderDiscrimination.PURCHASE && {
          pickup: {
            select: {
              real_pickup_date: true,
            },
          },
        }),
        ...(this.type !== AOrderDiscrimination.PURCHASE && {
          delivery: true,
        }),
        contact_aorder_supplier_idTocontact: {
          select: this.getContactSelect(),
        },
        contact_aorder_customer_idTocontact: {
          select: this.getContactSelect(),
        },
      },
      where: {
        ...query.where,
        ...(this.type && { discr: this.type }),
        ...(status && { status_id: { equals: status } }),
        ...this.getAndOrWhereInput({
          search, createdBy, partner, email,
        }),
      },
      orderBy: Object.keys(query?.orderBy || {})?.length ? query.orderBy : { id: 'desc' },
    };

    const result = <AOrderFindManyReturnType> <unknown> await this.repository.findAll(params);

    return {
      count: result.count,
      data: result.data.map(
        (order) => new AOrderProductProcess(new AOrderProcess(order).run()).run(),
      ),
    };
  }

  async findOne(id: number, email?: string) {
    const params: Prisma.aorderFindUniqueArgs = {
      where: {
        id,
        ...this.getPartnerWhereInput({ email }),
      },
    };

    const order = <AOrderPayloadRelation> await this.repository
      .findOne(this.commonIncludePart(params));

    if (!order || (this.type && order?.discr !== this.type)) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return new AOrderProcess(order).run();
  }

  async create(aorderDto: CreateAOrderDto, files?: Express.Multer.File[]) {
    if (this.type === undefined) {
      throw new BadRequestException('The operation requires a specific order type');
    }

    const {
      pickup, repair, delivery, ...commonDto
    } = aorderDto;

    const params: Prisma.aorderCreateArgs = {
      data: {
        ...await this.processCreateOrUpdateOrderInput(commonDto),
        order_nr: commonDto.order_nr || `TEMP${Math.floor(Date.now() / 1000).toString()}`,
        discr: this.type,
        order_date: new Date(),
        ...(pickup && { pickup: { create: { ...pickup } } }),
        ...(delivery && { delivery: { create: { ...delivery } } }),
        ...(repair && { repair: { create: { ...repair } } }),
      },
    };

    const order = <AOrderPayloadRelation> await this.repository
      .create(this.commonIncludePart(params));

    if (files?.length) {
      await this.uploadLogisticsFiles({
        files,
        logisticsId: this.type === AOrderDiscrimination.PURCHASE ? order.pickup.id : order.delivery.id,
      });
    }

    const vatCode = order.contact_aorder_supplier_idTocontact?.company_contact_company_idTocompany?.vat_code
    || order?.contact_aorder_customer_idTocontact?.company_contact_company_idTocompany?.vat_code
    || 2;

    const vatRate = VAT_CODES.find(({ code }) => code == vatCode).value || 0;

    if (commonDto.order_nr === undefined) {
      const { id, order_date: orderDate } = order;

      const orderNumber = orderDate.getFullYear() + id.toString().padStart(6, '0');

      try {
        await this.repository.update({
          where: { id },
          data: { order_nr: orderNumber, vat_rate: vatRate },
        });
        order.order_nr = orderNumber;
        order.vat_rate = vatRate;
      } catch (e) {
        this.repository.deleteMany([id]);
        throw e;
      }
    }

    return new AOrderProcess(order).run();
  }

  async update(id: number, aorderDto: UpdateAOrderDto, files?: Express.Multer.File[]) {
    const {
      pickup, repair, delivery, ...commonDto
    } = aorderDto;

    const data: Prisma.aorderUpdateInput = {
      ...await this.processCreateOrUpdateOrderInput(commonDto),
      ...(pickup && { pickup: { upsert: { update: { ...pickup }, create: { ...pickup } } } }),
      ...(delivery && { delivery: { upsert: { update: { ...delivery }, create: { ...delivery } } } }),
      ...(repair && { repair: { upsert: { update: { ...repair }, create: { ...repair } } } }),
    };

    const params: Prisma.aorderUpdateArgs = {
      data,
      where: { id },
    };

    const order = <AOrderPayloadRelation> await this.repository
      .update(this.commonIncludePart(params));

    if (files?.length) {
      await this.uploadLogisticsFiles({
        files,
        logisticsId: this.type === AOrderDiscrimination.PURCHASE ? order.pickup.id : order.delivery.id,
      });
    }

    return new AOrderProcess(order).run();
  }

  async updateMany(updateManyOrderDto: UpdateManyAOrderDto) {
    return this.repository.updateMany({
      data: updateManyOrderDto.order,
      where: {
        id: { in: updateManyOrderDto.ids },
      },
    });
  }

  async deleteOne(id: number) {
    const order = await this.findOne(id);
    if (order.discr === AOrderDiscrimination.PURCHASE) {
      if (order?.pickup?.afile?.length) {
        await this.fileService.deleteMany(
          order?.pickup?.afile?.map((file: { id: unknown; }) => file.id),
        );
      }
      if (order?.pickup?.id) {
        await this.repository.deletePickup(order?.pickup?.id);
      }
    } else {
      if (order?.delivery?.afile?.length) {
        await this.fileService.deleteMany(
          order?.delivery?.afile?.map((file: { id: unknown; }) => file.id),
        );
      }
      if (order?.delivery?.id) {
        await this.repository.deleteDelivery(order?.delivery?.id);
      }
    }

    return this.repository.deleteOne(id);
  }

  async deleteFiles(id: number, fileIds: number[]) {
    await this.findOne(id);

    return this.fileService.deleteMany(fileIds);
  }

  async findByIds({
    ids,
    product,
    email,
  }: {
    ids: number[],
    product: boolean,
    email?: string,
  }) {
    const params: Prisma.aorderFindManyArgs = {
      where: {
        id: { in: ids },
        ...this.getPartnerWhereInput({ email }),
      },
      orderBy: {
        id: 'asc',
      },
    };

    const result = <AOrderPayloadRelation[]> await this.repository
      .findBy(product ? this.productIncludePart(params) : this.commonIncludePart(params));

    return result.map((order) => new AOrderProcess(order).run());
  }

  async printAOrders(ids: number[], email?: string): Promise<Buffer> {
    const aorders = await this.findByIds({
      ids,
      product: false,
      email,
    });

    return this.printService.printAOrders(aorders);
  }

  async printExport(ids: number[], email?: string): Promise<Buffer> {
    const aorders = await this.findByIds({
      ids,
      product: true,
      email,
    });
    return this.printService.printExport(aorders);
  }

  protected async uploadLogisticsFiles({
    files, logisticsId,
  }: {
    files: Express.Multer.File[], logisticsId: number
  }): Promise<afile[]> {
    const afiles: afile[] = [];
    // group files by attribute id
    const filesGroupByFileDiscr: { [key in FileDiscrimination]?: Express.Multer.File[] } = files.reduce((acc, obj) => {
      const { fieldname } = obj;

      if (!acc[fieldname]) {
        acc[fieldname] = [];
      }

      acc[fieldname].push(obj);
      return acc;
    }, {});

    for (const [fileDiscr, mfiles] of Object.entries(filesGroupByFileDiscr)) {
      const createFileDto: CreateFileDto = {
        discr: <FileDiscrimination>fileDiscr,
        ...(this.type === AOrderDiscrimination.PURCHASE && { pickup_id: logisticsId }),
        ...(this.type !== AOrderDiscrimination.PURCHASE && { delivery_id: logisticsId }),
      };

      for (let i = 0; i < mfiles.length; i++) {
        const mfile = mfiles[i];
        // eslint-disable-next-line no-await-in-loop
        const aFile = await this.fileService.create(createFileDto, {
          Body: mfile.buffer,
          ContentType: mfile.mimetype,
        });
        afiles.push(aFile);
      }
    }

    return afiles;
  }

  protected async processCreateOrUpdateOrderInput(orderDto: CommonAOrderDto):
  Promise<CommonAOrderInput> {
    const {
      status_id: statusIdDto,
      customer_id: customerIdDto,
      customer,
      supplier_id: supplierIdDto,
      supplier,
      ...rest
    } = orderDto;

    let customerId: number;
    let supplierId: number;

    if (!customerIdDto && (customer?.company_id || customer?.company_name)) {
      customerId = (await this.contactService.checkExists({
        ...customer,
        company_is_partner: false,
        company_is_customer: true,
        company_is_supplier: false,
      }))?.id;
    }
    if (!supplierIdDto && (supplier?.company_id || supplier?.company_name)) {
      supplierId = (await this.contactService.checkExists({
        ...supplier,
        company_is_partner: false,
        company_is_customer: false,
        company_is_supplier: true,
      })).id;
    }

    const data: CommonAOrderInput = {
      ...rest,
      ...(statusIdDto && { order_status: { connect: { id: statusIdDto } } }),
      ...((customerIdDto || customerId)
      && { contact_aorder_customer_idTocontact: { connect: { id: customerIdDto || customerId } } }),
      ...((supplierIdDto || supplierId)
      && { contact_aorder_supplier_idTocontact: { connect: { id: supplierIdDto || supplierId } } }),
    };

    return data;
  }

  protected commonIncludePart<T extends Prisma.aorderDefaultArgs>(params: T): T {
    let { include } = params;
    include = {
      ...include,
      order_status: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      product_order: {
        include: {
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
              price: true,
            },
          },
        },
      },
    };

    if (this.type === AOrderDiscrimination.PURCHASE) {
      include = {
        ...include,
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
        contact_aorder_supplier_idTocontact: {
          select: this.getContactSelect(),
        },
      };
    }

    if (this.type !== AOrderDiscrimination.PURCHASE) {
      include = {
        ...include,
        delivery: {
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
        contact_aorder_customer_idTocontact: {
          select: this.getContactSelect(),
        },
        repair: true,
      };
    }

    return {
      ...params,
      include,
    };
  }

  protected productIncludePart<T extends Prisma.aorderDefaultArgs>(params: T): T {
    let { include } = this.commonIncludePart(params);
    include = {
      ...include,
      product_order: {
        include: {
          product: {
            include: {
              product_attribute_product_attribute_product_idToproduct: {
                include: {
                  attribute: {
                    include: {
                      attribute_option: true,
                    },
                  },
                },
              },
              product_type: true,
            },
          },
        },
      },
    };

    return {
      ...params,
      include,
    };
  }

  protected getContactSelect(): Prisma.contactSelect {
    return {
      id: true,
      company_contact_company_idTocompany: {
        select: {
          id: true,
          name: true,
          vat_code: true,
          company: {
            select: {
              id: true,
              name: true,
              vat_code: true,
              companyContacts: {
                select: {
                  id: true,
                  name: true,
                  street: true,
                  city: true,
                  zip: true,
                  is_main: true,
                },
              },
            },
          },
        },
      },
      name: true,
      email: true,
      phone: true,
      phone2: true,
      street: true,
      street_extra: true,
      city: true,
      zip: true,
      state: true,
      country: true,
    };
  }

  private getAndOrWhereInput(params: {
    search?: string,
    createdBy?: number,
    partner?: number,
    email?: string,
  }): Omit<Prisma.aorderWhereInput, 'id' | 'order_nr'> {
    const {
      search, createdBy, partner, email,
    } = params;
    return {
      ...((search || createdBy || partner || email) && {
        AND: [
          {
            ...this.getSearchWhereInput({ search }),
          },
          {
            ...this.getPartnerWhereInput({ createdBy, partner, email }),
          },
        ],
      }),
    };
  }

  private getSearchWhereInput(params: {
    search?: string
  }): Omit<Prisma.aorderWhereInput, 'id' | 'order_nr'> {
    const { search } = params;
    return {
      ...(search && {
        OR: [
          { order_nr: { contains: search } },
          { remarks: { contains: search } },
        ],
      }),
    };
  }

  private getPartnerWhereInput(params: {
    createdBy?: number,
    partner?: number,
    email?: string
  }): Omit<Prisma.aorderWhereInput, 'id' | 'order_nr'> {
    const { createdBy, partner, email } = params;
    return {
      ...((createdBy || partner || email) && {
        OR: [
          {
            contact_aorder_supplier_idTocontact: this
              .getContactWhereInput({ createdBy, partner, email }),
          },
          {
            contact_aorder_customer_idTocontact: this
              .getContactWhereInput({ createdBy, partner, email }),
          },
        ],
      }),
    };
  }

  private getContactWhereInput(params: {
    createdBy?: number,
    partner?: number,
    email?: string
  }): Prisma.contactWhereInput {
    const { createdBy, partner, email } = params;
    return {
      ...(createdBy && { id: createdBy }),
      ...(partner && { company_contact_company_idTocompany: { company: { id: partner } } }),
      ...(email && {
        company_contact_company_idTocompany: {
          OR: [
            { companyContacts: { some: { email } } },
            { company: { companyContacts: { some: { email } } } },
          ],
        },
      }),
    };
  }
}
