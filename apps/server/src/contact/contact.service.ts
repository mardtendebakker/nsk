import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ContactRepository } from './contact.repository';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindManyDto } from './dto/find-many.dto';
import { ContactEntity } from './entities/contact.entity';
import { ContactRelation } from './types/contact-relation';
import { CompanyService } from '../company/company.service';

@Injectable()
export class ContactService {
  constructor(
    protected readonly repository: ContactRepository,
    protected readonly companyService: CompanyService,
  ) {}

  async findAll(query: FindManyDto, email?: string) {
    const {
      search,
      company_id: companyId,
      is_customer: isCustomer,
      is_partner: isPartner,
      is_supplier: isSupplier,
    } = query;
    const where: Prisma.contactWhereInput = {
      ...query.where,
      ...this.getEmailSearchWhereInput(email, search),
      ...{
        company_contact_company_idTocompany: {
          id: companyId,
          is_customer: isCustomer,
          is_partner: isPartner,
          is_supplier: isSupplier,
        },
      },
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
          },
        },
        company_contact_company_idTocompany: true,
      },
      where,
      orderBy: Object.keys(query?.orderBy || {})?.length ? query.orderBy : { id: 'desc' },
    });

    // TODO refacto response DTO
    return {
      count,
      data: data.map(({ _count, company_contact_company_idTocompany, ...rest }) => ({
        ...rest,
        company: company_contact_company_idTocompany,
        ordersCount: _count.customerOrders + _count.supplierOrders,
      })),
    };
  }

  async findOne(id: number, email?: string) {
    const {
      company_contact_company_idTocompany: companyContactCompanyIdTocompany,
      ...rest
    } = <ContactRelation> await this.repository.findOne({
      where: {
        id,
        ...this.getPartnerWhereInput(email),
      },
      include: {
        company_contact_company_idTocompany: true,
      },
    });

    return {
      ...rest,
      company_name: companyContactCompanyIdTocompany?.name,
      company_kvk_nr: companyContactCompanyIdTocompany?.kvk_nr,
    };
  }

  async create(createDto: CreateContactDto, email?: string) {
    const {
      company_id: companyId,
      company_name: companyName,
      company_kvk_nr: companyKvkNr,
      company_rsin_nr: companyRsinNr,
      company_is_partner: companyIsPartner,
      company_is_customer: companyIsCustomer,
      company_is_supplier: companyIsSupplier,
      company_partner_id: companyPartnerId,
      company_vat_code: companyVatCode,
      ...restContactDto
    } = createDto;

    if (!companyId && !companyName) {
      throw new BadRequestException('Either company_id or company name is required');
    }

    if (restContactDto.is_main === undefined
      && !Number.isFinite(companyId)) { // check if it is the first contact of a new company
      restContactDto.is_main = true;
    }

    let customConnectOrCreate: Prisma.companyCreateNestedOneWithoutCompanyContactsInput;

    if (companyId) {
      customConnectOrCreate = {
        connect: { id: companyId },
      };
      if (companyIsPartner || companyIsCustomer || companyIsSupplier) {
        this.companyService.update(companyId, {
          ...(companyIsPartner && { is_partner: true }),
          ...(companyIsCustomer && { is_customer: true }),
          ...(companyIsSupplier && { is_supplier: true }),
        });
      }
    } else {
      customConnectOrCreate = {
        connectOrCreate: {
          where: {
            name: companyName,
          },
          create: {
            name: companyName,
            kvk_nr: companyKvkNr,
            rsin_nr: companyRsinNr,
            is_partner: companyIsPartner,
            is_customer: companyIsCustomer,
            is_supplier: companyIsSupplier,
            vat_code: companyVatCode,
            ...(companyPartnerId && { partner_id: companyPartnerId }),
            ...(email && { partner_id: (await this.findPartnerByEmail(email))?.id }),
          },
        },
      };
    }

    return this.repository.create({
      ...restContactDto,
      company_contact_company_idTocompany: customConnectOrCreate,
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
      company_name: companyName,
      company_kvk_nr: companyKvkNr,
      company_is_partner: companyIsPartner = false,
      company_is_customer: companyIsCustomer = false,
      company_is_supplier: companyIsSupplier = false,
      company_partner_id: companyPartnerId,
    } = updateDto;

    try {
      return await this.repository.update({
        data: {
          ...updateDto,
          ...((companyName
            || companyKvkNr
            || companyIsPartner
            || companyIsCustomer
            || companyIsSupplier
            || companyPartnerId
          )) && {
            company_contact_company_idTocompany: {
              update: {
                ...(companyName && { name: companyName }),
                ...(companyKvkNr && { kvk_nr: companyKvkNr }),
                ...(companyIsPartner && { is_partner: companyIsPartner }),
                ...(companyIsCustomer && { is_customer: companyIsCustomer }),
                ...(companyIsSupplier && { is_supplier: companyIsSupplier }),
                ...(companyPartnerId && { partner_id: companyPartnerId }),
              },
            },
          },
        },
        where: {
          id,
          ...this.getPartnerWhereInput(email),
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new ForbiddenException('Insufficient permissions to access this api!');
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
          ...(createDto.company_is_partner
            && { company_contact_company_idTocompany: { is_partner: true } }),
          ...(createDto.company_is_customer
            && { company_contact_company_idTocompany: { is_customer: true } }),
          ...(createDto.company_is_supplier
            && { company_contact_company_idTocompany: { is_supplier: true } }),
          AND: [
            { zip },
            {
              OR: [
                { ...(createDto.email?.length > 5 && { email: createDto.email }) },
                { ...(createDto.phone?.length > 5 && { phone: { contains: createDto.phone.replace('-', '') } }) },
              ],
            },
          ],
        },
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
          {
            company_contact_company_idTocompany: {
              OR: [
                { companyContacts: { some: { email } } },
                { company: { companyContacts: { some: { email } } } },
              ],
            },
          },
        ],
      }),
    };
  }

  private getSearchWhereInput(search?: string): Omit<Prisma.contactWhereInput, 'id'> {
    return {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      }),
    };
  }

  private getEmailSearchWhereInput(email?: string, search?: string): Omit<Prisma.contactWhereInput, 'id'> {
    return {
      ...(email && search && {
        OR: [
          { email, name: { contains: search } },
          {
            company_contact_company_idTocompany: {
              OR: [
                { companyContacts: { some: { email } } },
                { company: { companyContacts: { some: { email } } } },
              ],
            },
            name: { contains: search },
          },
        ],
      }),
      ...(email && !search && this.getPartnerWhereInput(email)),
      ...(!email && search && this.getSearchWhereInput(search)),
    };
  }
}
