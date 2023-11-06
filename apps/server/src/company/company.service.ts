import { CompanyRepository } from './company.repository';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { BadRequestException, ForbiddenException, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindManyDto } from './dto/find-many.dto';
import { CompanyEntity } from './entities/company.entity';
import { CompanyDiscrimination } from './types/company-discrimination.enum';
import { Prisma } from '@prisma/client';
import { IsPartner } from './types/is-partner.enum';
@Injectable()
export class CompanyService {
  constructor(
    protected readonly repository: CompanyRepository,
    @Inject('TYPE') protected readonly type?: CompanyDiscrimination,
  ) {}

  async findAll(query: FindManyDto, email?: string) {
    const { search, representative } = query;
    const where: Prisma.acompanyWhereInput = {
      ...query.where,
      ...(email && {
        OR: [
          { email },
          { acompany: { email } },
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
          { acompany: { email } },
        ],
      }),
    });
  }

  async create(comapnyDto: CreateCompanyDto, email?: string) {
    if (this.type === undefined) {
      throw new BadRequestException('The operation requires a specific company type');
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
            { acompany: { email } },
          ],
        }),
      },
    });
  }

  async update(id: number, comapnyDto: UpdateCompanyDto, email?: string) {
    try {
      return await this.repository.update({
        data: await this.prepareIsPartnerField({ id, ...comapnyDto }, email),
        where: {
          id,
          ...(email && {
            OR: [
              { email },
              { acompany: { email } },
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

  async checkExists(comapnyData: Partial<CompanyEntity>) {
    const zip = (comapnyData.zip ?? comapnyData.zip2);
    let company: CompanyEntity;

    if (zip) {
      company = await this.repository.findFirst({
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

    if (!company) {
      company = await this.create(comapnyData as CreateCompanyDto);
    }

    return company;
  }

  async prepareIsPartnerField<T extends { id?: number, email?: string, is_partner?: number; partner_id?: number }>(acompanyDto: T, email?: string): Promise<T> {
    const acompany = { ...acompanyDto };

    if (email) {
      const partner = await this.findPartnerByEmail(email);

      if (!partner) {
        throw new UnprocessableEntityException('No partner for provided user!');
      }

      if (acompany.id === partner.id) {
        acompany.email = partner.email; // to make sure partner can not change own email
      } else {
        acompany.is_partner = IsPartner.HAS_PARTNER;
        acompany.partner_id = partner.id;
      }

    } else if (acompany.is_partner === 0 && Number.isFinite(acompany.partner_id)) {
      acompany.is_partner = IsPartner.HAS_PARTNER;
    }
  
    return acompany;
  }
}
