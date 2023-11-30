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

  async findAll(query: FindManyDto) {
    const { search } = query;
    const where: Prisma.companyWhereInput = {
      name: { contains: search || '' }
    };

    const { count, data } = await this.repository.findAll({
      ...query,
      select: {
        id: true,
        name: true,
        kvk_nr: true,
        _count: {
          select: { contact_contact_company_idTocompany: true }
        },
      },
      where,
      orderBy: { id: 'desc' }
    });

    return {
      count,
      data: data.map(({_count, ...rest}) => ({
        ...rest,
        contactsCount: _count.contact_contact_company_idTocompany
      }))
    }
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async create(createDto: CreateCompanyDto) {
    if(await this.repository.findOne({where: { name:createDto.name }}))  {
      throw new ConflictException('Name already exist');
    }

    return this.repository.create(createDto);
  }

  async update(id: number, updateDto: UpdateCompanyDto) {
    if(await this.repository.findOne({where: { name:updateDto.name, NOT : {id} }}))  {
      throw new ConflictException('Name already exist');
    }

    return this.repository.update({ where:{id}, data: updateDto});
  }

  async delete(id: number) {
    if((await this.contactRepository.count({ where : { company_id:id} })) > 0){
      throw new ConflictException('All of this company\'s contacts should be deleted first.');
    }

    return this.repository.delete({
      where: { id },
    });
  }
}
