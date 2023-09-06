import { CompanyRepository } from './company.repository';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindManyDto } from './dto/find-many.dto';
import { CompanyEntity } from './entities/company.entity';
import { CompanyDiscrimination } from './types/company-discrimination.enum';

@Injectable()
export class CompanyService {
  constructor(
    protected readonly repository: CompanyRepository,
    @Inject('TYPE') protected readonly type?: CompanyDiscrimination,
  ) {}

  async findAll(query: FindManyDto) {
    const where = {
      ...query.where,
      ...(this.type && { discr: this.type }),
      name: {
        contains: query.search
      }
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

  async create(comapny: CreateCompanyDto) {
    if (this.type === undefined) {
      throw new BadRequestException('The operation requires a specific company type');
    }

    return this.repository.create({
      discr: this.type,
      ...comapny,
    });
  }

  async findOne(id: number) {
    return this.repository.findOne({ id });
  }

  async delete(id: number) {
    return this.repository.delete({ where: { id } });
  }

  async update(id: number, comapny: UpdateCompanyDto) {
    return this.repository.update({
      data: comapny,
      where: { id }
    });
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
                { ...(comapnyData.name.length > 2 && { name: comapnyData.name }) },
                { ...(comapnyData.email.length > 5 && { email: comapnyData.email }) },
                { ...(comapnyData.phone.length > 5 && { phone: { contains: comapnyData.phone.replace("-", "") } }) },
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
}
