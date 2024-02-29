import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlanccoRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  findOrCreateProductType(data: Prisma.product_typeCreateInput) {
    return this.prisma.product_type.upsert({
      where: {
        name: data.name
      },
      create: data,
      update: {}
    });
  }

  createDefaultAttribute(data: Prisma.attributeCreateInput) {
    return this.prisma.attribute.upsert({
      where: { name: data.name },
      create: data,
      update: {},
    });
  }
  
  deleteProductTypesAttributesByProductTypeId(product_type_id: number) {
    return this.prisma.product_type_attribute.deleteMany({
      where: { product_type_id }
    });
  }

  createProductTypesAttributes(data: Prisma.product_type_attributeCreateManyInput[]) {
    return this.prisma.product_type_attribute.createMany({
      data
    });
  }

  findFirst(params: Prisma.product_typeFindFirstArgs) {
    return this.prisma.product_type.findFirst(params);
  }
}
