import { ContactRepository } from './contact.repository';
import { UpdateContactDto } from './dto/update-contact.dto';
import { BadRequestException, ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindManyDto } from './dto/find-many.dto';
import { ContactEntity } from './entities/contact.entity';
import { Prisma } from '@prisma/client';
import { PrismaContactCreateInputDto } from './dto/prisma-contact-create-input.dto';
import { ContactSelect } from './types/contact-select';
import { PrismaContactUpdateInputDto } from './dto/prisma-contact-update-input.dto';
@Injectable()
export class ContactService {
  constructor(
    protected readonly repository: ContactRepository,
  ) {}

  async findAll(query: FindManyDto, email?: string) {
    const { search, company, is_customer, is_partner, is_supplier } = query;
    const where: Prisma.contactWhereInput = {
      ...query.where,
      ...(email && {
        OR: [
          { email },
          { contact: { email } },
        ],
      }),
      is_customer,
      is_partner,
      is_supplier,
      ...(company && { company_contact_company_idTocompany: { name: { contains: company } } }),
      ...(search && { OR: [
        { name: { contains: search } },
        { email: { contains: search } },
      ] }),
    };

    const { count, data } = await this.repository.findAll({
      ...query,
      select: {
        ...query.select,
        id: true,
        name: true,
        email: true,
        partner_id: true,
        is_partner: true,
        is_customer: true,
        is_supplier: true,
        _count: {
          select: {
            customerOrders: true,
            supplierOrders: true,
          }
        },
        company_contact_company_idTocompany: true,
      },
      where
    });

    //TODO refacto response DTO
    return {
      count,
      data: data.map(({ _count, company_contact_company_idTocompany, ...rest }) => ({
        ...rest,
        company_name: company_contact_company_idTocompany?.name,
        ordersCount: _count.customerOrders + _count.supplierOrders
      }))
    }
  }

  async findOne(id: number, email?: string) {
    const { company_contact_company_idTocompany, ...rest } = <ContactSelect>await this.repository.findOne({
      where: {
        id,
        ...(email && {
          OR: [
            { email },
            { contact: { email } },
          ],
        }),
      },
      include: {
        company_contact_company_idTocompany: true,
      }
    });

    return {
      ...rest,
      company_name: company_contact_company_idTocompany?.name,
      company_kvk_nr: company_contact_company_idTocompany?.kvk_nr,
    }
  }

  async create(createDto: CreateContactDto, email?: string) {
    const { company_id, company_name, company_kvk_nr, is_customer, is_supplier, ...rest } = createDto;
    if (!company_id && !company_name) {
      throw new BadRequestException('Either company_id or company name is required');
    }

    return this.repository.create({
      ...(await this.prepareIsPartnerField(rest, email)) as PrismaContactCreateInputDto,
      is_customer,
      is_supplier,
      company_contact_company_idTocompany: {
        connectOrCreate: {
          where: {
            ...(company_id && { id: company_id } || { name: company_name }),
          },
          create: {
            name: company_name,
            kvk_nr: company_kvk_nr,
          },
        },
      },
    });
  }

  async findPartnerByEmail(email: string) {
    return this.repository.findFirst({
      where: {
        email,
        is_partner: true
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

  async update(id: number, updateDto: UpdateContactDto, email?: string) {
    const { company_name, company_kvk_nr, ...rest } = updateDto;

    try {
      return await this.repository.update({
        data: {
          ...await this.prepareIsPartnerField({ id, ...rest }, email),
          ...(company_name && { company_contact_company_idTocompany: { update: { name: company_name } } }),
          ...(company_kvk_nr && { company_contact_company_idTocompany: { update: { kvk_nr: company_kvk_nr } } }),
        },
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

  async checkExists(createDto: CreateContactDto) {
    const zip = (createDto.zip ?? createDto.zip2);
    let contact: ContactEntity;

    if (zip) {
      contact = await this.repository.findFirst({
        where: {
          AND: [
            { zip: zip },
            {
              OR: [
                { ...(createDto.email?.length > 5 && { email: createDto.email }) },
                { ...(createDto.phone?.length > 5 && { phone: { contains: createDto.phone.replace("-", "") } }) },
              ]
            },
          ],
        }
      });
    }

    if (!contact) {
      contact = await this.create(createDto);
    }

    return contact;
  }

  async prepareIsPartnerField<T extends { id?: number, email?: string, is_partner?: boolean; partner_id?: number }>(contactDto: T, email?: string): Promise<Partial<PrismaContactCreateInputDto>> {
    const { id, is_partner, partner_id, ...rest } = contactDto;
    const createContactDto: PrismaContactUpdateInputDto = { ...rest };

    if (is_partner !== undefined && is_partner !== null) {
      createContactDto.is_partner = is_partner;
    }

    if (email) {
      const partner = await this.findPartnerByEmail(email);

      if (!partner) {
        throw new UnprocessableEntityException('No partner for provided user!');
      }

      if (id === partner.id) {
        createContactDto.email = partner.email; // to make sure partner can not change own email
      } else {
        createContactDto.is_partner = false;
        createContactDto.contact = { connect: { id: partner_id }};
      }

    } else if (Number.isFinite(partner_id)) {
      createContactDto.is_partner = false;
      createContactDto.contact = { connect: { id: partner_id }};
    }
  
    return createContactDto;
  }
}
