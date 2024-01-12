import { ConflictException, Injectable } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { FindManyDto } from './dto/find-many.dto';
import { Prisma } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ContactRepository } from '../contact/contact.repository';

@Injectable()
export class CompanyService {
  constructor(
    protected readonly repository: CompanyRepository,
    protected readonly contactRepository: ContactRepository
  ) {}

  async findAll(query: FindManyDto, email?: string) {
    const { search, is_customer, is_partner, is_supplier } = query;
    const where: Prisma.companyWhereInput = {
      ...this.getPartnerWhereInput(email),
      name: { contains: search || '' },
      is_customer,
      is_partner,
      is_supplier
    };

    const { count, data } = await this.repository.findAll({
      ...query,
      select: {
        id: true,
        name: true,
        kvk_nr: true,
        is_customer: true,
        is_partner: true,
        is_supplier: true,
        _count: {
          select: { companyContacts: true }
        },
      },
      where,
      orderBy: { id: 'desc' }
    });

    return {
      count,
      data: data.map(({_count, ...rest}) => ({
        ...rest,
        contactsCount: _count.companyContacts
      }))
    }
  }

  findOne(id: number, email?: string) {
    return this.repository.findOne({
      where: {
        id,
        ...this.getPartnerWhereInput(email),
      } 
    });
  }

  async create(createDto: CreateCompanyDto, email?: string) {
    if(await this.repository.findOne({where: { name:createDto.name }}))  {
      throw new ConflictException('Name already exist');
    }

    return this.repository.create({
      ...createDto,
      ...(email && { partner_id: (await this.findPartnerByEmail(email))?.id}),
    });
  }

  async update(id: number, updateDto: UpdateCompanyDto, email?: string) {
    if(await this.repository.findOne({where: { name:updateDto.name, NOT : {id} }}))  {
      throw new ConflictException('Name already exist');
    }

    return this.repository.update({
      where:{
        id,
        ...this.getPartnerWhereInput(email),
      },
      data: updateDto
    });
  }

  async delete(id: number, email?: string) {
    if((await this.contactRepository.count({ where : { company_id:id} })) > 0){
      throw new ConflictException('All of this company\'s contacts should be deleted first.');
    }

    return this.repository.delete({
      where: {
        id,
        ...this.getPartnerWhereInput(email),
      },
    });
  }

  async findPartnerByEmail(email: string) {
    return this.repository.findFirst({
      where: {
        companyContacts: {
          every: { email, is_main: true }
        },
      },
    });
  }

  private getPartnerWhereInput(email?: string): Omit<Prisma.companyWhereInput, 'id' | 'name'> {
    return {
      ...(email && {
        OR: [
          { companyContacts: { every: { email } } },
          { company: { companyContacts: { every: { email } } } },
        ],
      }),
    };
  }
}
