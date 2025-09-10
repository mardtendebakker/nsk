import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateProductSubTypeDto } from './dto/update-product-sub-type.dto';
import { ProductSubTypeRepository } from './product-sub-type.repository';
import { ProductSubTypeRelation } from './types/product-sub-type-relation';
import { CreateProductSubTypeDto } from './dto/create-product-sub-type.dto';

@Injectable()
export class ProductSubTypeService {
  constructor(protected readonly repository: ProductSubTypeRepository) {}

  async findAll(query: FindManyDto) {
    const result = await this.repository.findAll({
      select: this.processSelect(),
      skip: query.skip,
      take: query.take,
      where: {
        name: {
          contains: query.search,
        },
      },
    });

    return {
      ...result,
      data: result.data,
    };
  }

  async findOne(id: number) {
    const params: Prisma.product_sub_typeFindUniqueArgs = {
      select: this.processSelect({
        pindex: true,
      }),
      where: { id },
    };

    const productSubType = <ProductSubTypeRelation> await this.repository.findOne(params);

    return productSubType;
  }

  async update(id: number, updateProductSubTypeDto: UpdateProductSubTypeDto) {
    return this.repository.update({
      where: { id },
      data: updateProductSubTypeDto,
    });
  }

  async create(createProductSubTypeDto: CreateProductSubTypeDto) {
    return this.repository.create({
      data: createProductSubTypeDto,
    });
  }

  private processSelect(
    select: Prisma.product_sub_typeSelect = {},
  ): Prisma.product_sub_typeSelect {
    return {
      ...select,
      id: true,
      name: true,
      product_type_id: true,
      magento_category_id: true,
      magento_attr_set_id: true,
      magento_group_spec_id: true,
      pindex: true,
      productType: {
        select: {
          id: true,
          name: true,
        },
      },
    };
  }
}
