import { FindManyDto } from './dto/find-many.dto';
import { ProductTypeRepository } from './product-type.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductTypeService {
  constructor(protected readonly repository: ProductTypeRepository) {}

  async findAll(query: FindManyDto) {
    const result = await this.repository.findAll({
      select: {
        id: true,
        name: true,
        product_type_attribute: {
          select: {
            attribute: {
              select : {
                id: true,
                name: true,
                type: true,
                attribute_option: {
                  select: {
                    id: true,
                    name: true,
                    price: true
                  }
                }
              },
            }
          }
        },
      },
      skip: query.skip,
      take: query.take,
      where: {
        id: {
          in: query.ids
        },
        name: {
          contains: query.search
        },
        is_attribute: query.attributeOnly == 1 ? true : undefined,
      }
    });

    return {
      ...result,
      data: result.data.map(({product_type_attribute, ...rest})=> ({
          ...rest,
          attributes: product_type_attribute.map(
            ({attribute: {attribute_option, ...rest}}: any) => ({
            ...rest,
              options: attribute_option
            })
          )
      }))
    };
  }
}
