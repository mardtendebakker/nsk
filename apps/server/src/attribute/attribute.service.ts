import { Prisma } from '@prisma/client';
import { ConflictException, Injectable } from '@nestjs/common';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { AttributeRepository } from './attribute.repository';
import { AttributeGetPayload } from './types/attribute-get-payload';
import { CreateAttributeDto } from './dto/create-attribute.dto';

@Injectable()
export class AttributeService {
  private select: Prisma.attributeSelect;

  constructor(protected readonly repository: AttributeRepository) {
    this.select = {
      id: true,
      attr_code: true,
      name: true,
      price: true,
      type: true,
      is_public: true,
      magento_attr_code: true,
      product_type_attribute: {
        select: {
          product_type_id: true,
        },
      },
      attribute_option: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    };
  }

  async findAll(query: FindManyDto) {
    const where: Prisma.attributeWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { attr_code: { contains: query.search } },
      ];
    }

    const { count, data } = await this.repository.findAll({
      ...query,
      select: this.select,
      where,
    });

    return {
      count,
      data: data.map((attribute) => ({
        ...({ ...attribute, product_type_attribute: undefined, attribute_option: undefined }), // removing extra fileds
        productTypes: attribute.product_type_attribute.map((productTypeAttribute) => ({ id: productTypeAttribute.product_type_id })),
        options: attribute.attribute_option,
      })),
    };
  }

  async findOne(id: number) {
    const params: Prisma.attributeFindUniqueArgs = {
      where: { id },
      select: this.select,
    };

    const attribute: AttributeGetPayload = await this.repository.findOne(params);

    return {
      ...({ ...attribute, product_type_attribute: undefined, attribute_option: undefined }), // removing extra fileds
      productTypes: attribute.product_type_attribute.map((productTypeAttribute) => ({ id: productTypeAttribute.product_type_id })),
      options: attribute.attribute_option,
    };
  }

  async update(id: number, updateAttributeDto: UpdateAttributeDto) {
    const {
      productTypes,
      options,
      ...rest
    } = updateAttributeDto;

    if (productTypes) await this.repository.deleteAllProductTypes(id);
    if (options) await this.repository.deleteAllOptions(id);

    return this.repository.update({
      where: { id },
      data: {
        ...rest,
        ...(productTypes && {
          product_type_attribute: {
            create: productTypes.map((productTypeId) => ({ product_type_id: productTypeId })),
          },
        }),
        ...(options && { attribute_option: { create: options } }),
      },
    });
  }

  async create(createAttributeDto: CreateAttributeDto) {
    const {
      productTypes,
      options,
      ...rest
    } = createAttributeDto;

    const productTypeCreate: Prisma.product_type_attributeUncheckedCreateWithoutAttributeInput[] = productTypes.map((productTypeId) => ({ product_type_id: productTypeId }));

    if (await this.repository.findOne({ where: { name: rest.name } })) {
      throw new ConflictException('Name already exist');
    }

    return this.repository.create({
      data: {
        ...rest,
        product_type_attribute: { create: productTypeCreate },
        attribute_option: { create: options },
      },
    });
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}
