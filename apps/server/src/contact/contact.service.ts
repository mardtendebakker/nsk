import { ContactRepository } from './contact.repository';
import { UpdateContactDto } from './dto/update-contact.dto';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindManyDto } from './dto/find-many.dto';
import { ContactEntity } from './entities/contact.entity';
import { Prisma } from '@prisma/client';
import { ContactSelect } from './types/contact-select';
@Injectable()
export class ContactService {
  constructor(
    protected readonly repository: ContactRepository,
  ) {}

  async findAll(query: FindManyDto, email?: string) {
    const { search, company, is_customer, is_partner, is_supplier } = query;
    const where: Prisma.contactWhereInput = {
      ...query.where,
      email,
      ...{ company_contact_company_idTocompany: {
         name: { contains: company },
         is_customer,
         is_partner,
         is_supplier
        }
      },
      ...(search && { OR: [
        { name: { contains: search } },
        { email: { contains: search } },
      ] })
    };

    const { count, data } = await this.repository.findAll({
      ...query,
      select: {
        ...query.select,
        id: true,
        name: true,
        email: true,
        partner_id: true,
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
        company: company_contact_company_idTocompany,
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

  async create(createDto: CreateContactDto) {
    console.log(createDto)

    const { company_id, company_name = '', company_kvk_nr, is_customer = false, is_supplier = false, is_partner = false } = createDto;
    if (!company_id && !company_name) {
      throw new BadRequestException('Either company_id or company name is required');
    }
    
    return this.repository.create({
      company_contact_company_idTocompany: {
        connectOrCreate: {
          where: {
            ...(company_id && { id: company_id } || { name: company_name }),
          },
          create: {
            name: company_name,
            kvk_nr: company_kvk_nr,
            is_supplier,
            is_customer,
            is_partner
          },
        },
      },
    });
  }

  async findPartnerByEmail(email: string) {
    return this.repository.findFirst({
      where: {
        email,
        company_contact_company_idTocompany: {
          is_partner: true
        }
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
          ],
        }),
      },
    });
  }

  async update(id: number, updateDto: UpdateContactDto, email?: string) {
    const { company_name, company_kvk_nr } = updateDto;

    try {
      return await this.repository.update({
        data: {
          ...(company_name && { company_contact_company_idTocompany: { update: { name: company_name } } }),
          ...(company_kvk_nr && { company_contact_company_idTocompany: { update: { kvk_nr: company_kvk_nr } } }),
        },
        where: {
          id,
          ...(email && {
            OR: [
              { email },
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
}
