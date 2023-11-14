import { ContactRepository } from './contact.repository';
import { UpdateContactDto } from './dto/update-contact.dto';
import { BadRequestException, ForbiddenException, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindManyDto } from './dto/find-many.dto';
import { ContactEntity } from './entities/contact.entity';
import { ContactDiscrimination } from './types/contact-discrimination.enum';
import { Prisma } from '@prisma/client';
import { IsPartner } from './types/is-partner.enum';
@Injectable()
export class ContactService {
  constructor(
    protected readonly repository: ContactRepository,
    @Inject('TYPE') protected readonly type?: ContactDiscrimination,
  ) {}

  async findAll(query: FindManyDto, email?: string) {
    const { search, representative } = query;
    const where: Prisma.contactWhereInput = {
      ...query.where,
      ...(email && {
        OR: [
          { email },
          { contact: { email } },
        ],
      }),
      ...(this.type && { discr: this.type }),
      ...(representative && { representative: { contains: representative }}),
      ...(search && { name: { contains: search } }),
    }

    const { count, data } = await this.repository.findAll({
      ...query,
      select: {
        ...query.select,
        id: true,
        name: true,
        representative: true,
        email: true,
        partner_id: true,
        customerOrders: true,
        supplierOrders: true
      },
      where
    });

    //TODO refacto response DTO
    return {
      count,
      data: data.map(({ customerOrders, supplierOrders, ...rest }) => ({
        ...rest,
        orders: customerOrders.length > 0 ? customerOrders : supplierOrders
      }))
    }
  }

  async findOne(id: number, email?: string) {
    return this.repository.findOne({
      id,
      ...(email && {
        OR: [
          { email },
          { contact: { email } },
        ],
      }),
    });
  }

  async create(comapnyDto: CreateContactDto, email?: string) {
    if (this.type === undefined) {
      throw new BadRequestException('The operation requires a specific contact type');
    }

    return this.repository.create({
      data: {
        discr: this.type,
        ...await this.prepareIsPartnerField(comapnyDto, email),
      },
    });
  }

  async findPartnerByEmail(email: string) {
    return this.repository.findFirst({
      where: {
        email,
        is_partner: { gte: IsPartner.PARTNER }
      },
    });
  }

  async delete(id: number, email?: string) {
    return this.repository.delete({
      where: {
        id,
        ...(email && {
          OR: [
            { email },
            { contact: { email } },
          ],
        }),
      },
    });
  }

  async update(id: number, comapnyDto: UpdateContactDto, email?: string) {
    try {
      return await this.repository.update({
        data: await this.prepareIsPartnerField({ id, ...comapnyDto }, email),
        where: {
          id,
          ...(email && {
            OR: [
              { email },
              { contact: { email } },
            ],
          }),
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new ForbiddenException("Insufficient permissions to access this api!");
      } else {
        throw err;
      }
    }
  }

  async checkExists(comapnyData: Partial<ContactEntity>) {
    const zip = (comapnyData.zip ?? comapnyData.zip2);
    let contact: ContactEntity;

    if (zip) {
      contact = await this.repository.findFirst({
        where: {
          ...(this.type && { discr: this.type }),
          AND: [
            { zip: zip },
            {
              OR: [
                { ...(comapnyData.name?.length > 2 && { name: comapnyData.name }) },
                { ...(comapnyData.email?.length > 5 && { email: comapnyData.email }) },
                { ...(comapnyData.phone?.length > 5 && { phone: { contains: comapnyData.phone.replace("-", "") } }) },
              ]
            },
          ],
        }
      });
    }

    if (!contact) {
      contact = await this.create(comapnyData as CreateContactDto);
    }

    return contact;
  }

  async prepareIsPartnerField<T extends { id?: number, email?: string, is_partner?: number; partner_id?: number }>(contactDto: T, email?: string): Promise<T> {
    const contact = { ...contactDto };

    if (email) {
      const partner = await this.findPartnerByEmail(email);

      if (!partner) {
        throw new UnprocessableEntityException('No partner for provided user!');
      }

      if (contact.id === partner.id) {
        contact.email = partner.email; // to make sure partner can not change own email
      } else {
        contact.is_partner = IsPartner.HAS_PARTNER;
        contact.partner_id = partner.id;
      }

    } else if (contact.is_partner === 0 && Number.isFinite(contact.partner_id)) {
      contact.is_partner = IsPartner.HAS_PARTNER;
    }
  
    return contact;
  }
}
