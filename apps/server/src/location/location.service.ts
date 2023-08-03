import { Injectable } from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { FindManyDto } from './dto/find-many.dto';
import { Prisma } from '@prisma/client';

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
}
