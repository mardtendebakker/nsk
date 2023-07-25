import { Injectable } from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { FindManyDto } from './dto/find-many.dto';

@Injectable()
export class LocationService {
  constructor(protected readonly repository: LocationRepository) {}

  getAll() {
    return this.repository.getAll();
  }

  findAll(query: FindManyDto) {
    return this.repository.findAll({
      ...query,
      where: {
        id: {
          in: query.ids
        },
        OR: query.search ? [
          {name: { contains: query.search }},
          {zipcodes: { contains: query.search }},
        ] : undefined
      }
    });
  }
}
