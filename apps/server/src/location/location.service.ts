import { Injectable } from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { FindManyDto } from './dto/find-many.dto';
import { Prisma } from '@prisma/client';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationService {
  constructor(protected readonly repository: LocationRepository) {}

  getAll() {
    return this.repository.getAll();
  }

  findAll(query: FindManyDto) {
    const where: Prisma.locationWhereInput = {};

    if(query.ids) {
      where.id = { in: query.ids };
    }

    if(query.name) {
      where.name = { contains: query.name };
    }

    if(query.search) {
      where.OR = [
        { name: { contains: query.search }},
        { zipcodes: { contains: query.search }},
      ];
    }

    return this.repository.findAll({ ...query, where });
  }

  findOne(id: number) {
    return this.repository.findOne({where: {id}});
  }

  update(id: number, body: UpdateLocationDto) {
    return this.repository.update({ where: {id}, data: body });
  }

  create(body: CreateLocationDto) {
    return this.repository.create(body);
  }
}
