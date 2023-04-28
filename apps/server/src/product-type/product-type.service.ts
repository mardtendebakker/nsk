import { FindManyDto } from './dto/find-many.dto';
import { ProductTypeRepository } from './product-type.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductTypeService {
  constructor(protected readonly repository: ProductTypeRepository) {}

  findAll(query: FindManyDto) {
    return this.repository.findAll({
      ...query,
      where: {
        name: {
          contains: query.nameContains
        },
        is_attribute: query.attributeOnly == 1 ? true : undefined
      }
    });
  }
}
