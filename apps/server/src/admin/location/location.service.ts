import { ConflictException, Injectable } from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { FindManyDto } from './dto/find-many.dto';
import { Prisma } from '@prisma/client';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(
    protected readonly repository: LocationRepository,
    protected readonly prisma: PrismaService,
    ) {}

  getAll() {
    return this.repository.getAll();
  }

  findAll(query: FindManyDto) {
    const where: Prisma.locationWhereInput = {};

    if(query.search) {
      where.OR = [
        { name: { contains: query.search }},
        { zipcodes: { contains: query.search }},
      ];
    }

    return this.repository.findAll({ ...query, where });
  }

  findOne(id: number) {
    return this.repository.findOne({where: {id}, include: { location_template: true }});
  }

  async update(id: number, body: UpdateLocationDto) {
    const { name, location_template, zipcodes } = body;
    if(name && await this.repository.findOne({where: { name, NOT: { id } }}))  {
      throw new ConflictException('Name already exist');
    }

    let result;

    await this.prisma.$transaction(async (tx) => {
      result = await tx.location.update({ data : { name, zipcodes } , where : { id }});

      if(Array.isArray(location_template)) {
        await tx.location_template.deleteMany({ where: { location_id: id }});
        await tx.location_template.createMany({ data: location_template.map((template) => ({ template, name:template, location_id: id })) });
      }
    });

    return result;
  }

  async create(body: CreateLocationDto) {
    const { name, location_template, zipcodes } = body;
    if(await this.repository.findOne({where: { name }}))  {
      throw new ConflictException('Name already exist');
    }

    let result;

    await this.prisma.$transaction(async (tx) => {
      result = await tx.location.create({ data : { name, zipcodes } });
      if(location_template?.length > 1) {
        await tx.location_template.createMany({ data: location_template.map((template) => ({ template, name:template, location_id: result.id })) })
      }
    });

    return result;
  }
}
