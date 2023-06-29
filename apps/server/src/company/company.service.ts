import { CompanyRepository } from './company.repository';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindManyDto } from './dto/find-many.dto';

@Injectable()
export class CompanyService {
  constructor(
    protected readonly repository: CompanyRepository,
  ) {}

  async findAll(query: FindManyDto) {
    const where = {
      ...query.where,
      id: {
        in: query.ids
      },
      name: {
        contains: query.search
      }
    }

    if(query.partnerOnly == 1) {
      where.is_partner = {
          gt: 0
      }
    }

    const {count, data} = await this.repository.findAll({
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
      data: data.map(({customerOrders, supplierOrders, ...rest}) => ({
        ...rest,
        orders: customerOrders.length > 0 ? customerOrders : supplierOrders
      }))
    }
  }

  async create(comapny: CreateCompanyDto) {
    return this.repository.create(comapny as Prisma.acompanyCreateInput);
  }

  async findOne(id: number) {
    return this.repository.findOne({ id });
  }

  async delete(id: number) {
    return this.repository.delete({ where: {id} });
  }

  async update(id: number, comapny: UpdateCompanyDto) {
    return this.repository.update({
      data: comapny,
      where: { id }
    });
  }
}
