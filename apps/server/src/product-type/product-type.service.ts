import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ProductTypeRepository } from './product-type.repository';
import { Injectable } from '@nestjs/common';
import { ProductTypeProcess } from './product-type-process';
import { ProductTypeRelation } from './types/product-type-relation';

@Injectable()
export class ProductTypeService {
  constructor(protected readonly repository: ProductTypeRepository) {}

  async findAll(query: FindManyDto) {
    const result = await this.repository.findAll({
      select: this.processSelect(),
      skip: query.skip,
      take: query.take,
      where: {
        id: {
          in: query.ids,
        },
        name: {
          contains: query.search,
        },
        is_attribute: query.attributeOnly == 1 ? true : undefined,
      },
    });

    return {
      ...result,
      data: result.data.map(this.processProductType),
    };
  }

  async findOne(id: number) {
    const params: Prisma.product_typeFindUniqueArgs = {
      select: this.processSelect({
        pindex: true,
        comment: true,
        is_attribute: true,
        is_public: true,
        external_id: true,
      }),
      where: { id },
    };

    const productType = await this.repository.findOne(params);

    return this.processProductType(productType);
  }

  async update(id: number, updateProductTypeDto: UpdateProductTypeDto) {
    const { attributes, tasks, ...rest } = updateProductTypeDto;
    return this.repository.update({
      where: { id },
      data: {
        ...rest,
        product_type_attribute: {
          deleteMany: {
            product_type_id: id,
          },
          createMany: {
            data: attributes.map(attributeId => ({
              attribute_id: attributeId,
            }))
          },
        },
        product_type_task: {
          deleteMany: {
            product_type_id: id,
          },
          createMany: {
            data: tasks.map(taskId => ({
              task_id: taskId,
            }))
          },
        },
      },
    });
  }

  private processSelect(
    select: Prisma.product_typeSelect = {}
  ): Prisma.product_typeSelect {
    return {
      ...select,
      id: true,
      name: true,
      product_type_attribute: {
        select: {
          attribute: {
            select: {
              id: true,
              name: true,
              type: true,
              attribute_option: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      },
      product_type_task: {
        select: {
          task: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      }
    };
  }

  private processProductType(productType: ProductTypeRelation) {
    return new ProductTypeProcess(productType).run();
  }
}
