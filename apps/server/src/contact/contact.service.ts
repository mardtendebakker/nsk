import { ContactRepository } from './contact.repository';
import { UpdateContactDto } from './dto/update-contact.dto';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindManyDto } from './dto/find-many.dto';
import { ContactEntity } from './entities/contact.entity';
import { Prisma } from '@prisma/client';
import { ContactSelect } from './types/contact-select';
import { CompanyService } from '../company/company.service';
@Injectable()
export class ContactService {
  constructor(
    protected readonly repository: ContactRepository,
    protected readonly companyService: CompanyService,
  ) {}

  async findAll(query: FindManyDto, email?: string) {
    const { search, company, is_customer, is_partner, is_supplier } = query;
    const where: Prisma.contactWhereInput = {
      ...query.where,
      ...this.getPartnerWhereInput(email),
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
        ...this.getPartnerWhereInput(email),
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
    const {
      company_id,
      company_name = '',
      company_kvk_nr,
      is_partner = false,
      is_customer = false,
      is_supplier = false,
    } = createDto;

    let { is_main } = createDto;

    if (!company_id && !company_name) {
      throw new BadRequestException('Either company_id or company name is required');
    }

    if (is_main == undefined && !isFinite(company_id)) {
      is_main = true;
    }
    
    return this.repository.create({
      ...createDto,
      is_main,
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
            is_partner,
            ...(email && { partner_id: (await this.findPartnerByEmail(email))?.id}),
          },
        },
      },
    });
  }
  
  async findPartnerByEmail(email: string) {
    return this.companyService.findPartnerByEmail(email);
  }

  async delete(id: number, email?: string) {
    return this.repository.delete({
      where: {
        id,
        ...this.getPartnerWhereInput(email),
      },
    });
  }

  async update(id: number, updateDto: UpdateContactDto, email?: string) {
    const {
      company_name,
      company_kvk_nr,
      is_partner = false,
      is_customer = false,
      is_supplier = false,
    } = updateDto;

    try {
      return await this.repository.update({
        data: {
          ...updateDto,
          ...(company_name && { company_contact_company_idTocompany: { update: { name: company_name } } }),
          ...(company_kvk_nr && { company_contact_company_idTocompany: { update: { kvk_nr: company_kvk_nr } } }),
          ...(is_partner && { company_contact_company_idTocompany: { update: { is_partner } } }),
          ...(is_customer && { company_contact_company_idTocompany: { update: { is_customer } } }),
          ...(is_supplier && { company_contact_company_idTocompany: { update: { is_supplier } } }),
        },
        where: {
          id,
          ...this.getPartnerWhereInput(email),
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
          ...(createDto.is_partner && { company_contact_company_idTocompany: { is_partner: true } }),
          ...(createDto.is_customer && { company_contact_company_idTocompany: { is_customer: true } }),
          ...(createDto.is_supplier && { company_contact_company_idTocompany: { is_supplier: true } }),
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

  private getPartnerWhereInput(email?: string): Omit<Prisma.contactWhereInput, 'id'> {
    return {
      ...(email && {
        OR: [
          { email },
          { company_contact_company_idTocompany: { company: { companyContacts: { every: { email } } } } },
        ],
      }),
    };
  }
}
