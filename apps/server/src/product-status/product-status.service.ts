import { FindManyDto } from './dto/find-many.dto';
import { ProductStatusRepository } from './product-status.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductStatusService {
  constructor(protected readonly repository: ProductStatusRepository) {}

  findAll(query: FindManyDto) {
    return this.repository.findAll({
      ...query,
      where: {
        name: {
          contains: query.nameContains
        },
      }
    });
  }
}
