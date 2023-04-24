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

  findAll(query: FindManyDto) {
    const where = {
      ...query.where,
      name: {
        contains: query.nameContains
      }
    }

    if(query.partnerOnly > 0) {
      where.is_partner = {
          gt: 0
      }
    }

    return this.repository.findAll({
      ...query,
      select: {
        ...query.select,
        id: true,
        name: true,
        representative: true,
        email: true,
        partner_id: true
      },
      where
    });
  }

  async create(comapny: CreateCompanyDto) {
    return this.repository.create(comapny as Prisma.acompanyCreateInput);
  }

  async findOne(id: number) {
    return this.repository.findOne({ id });
  }

  async update(id: number, comapny: UpdateCompanyDto) {
    return this.repository.update({
      data: comapny,
      where: { id }
    });
  }
}
