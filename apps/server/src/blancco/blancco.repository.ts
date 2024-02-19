import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BlanccoDefaultProductType } from './types/blancco-defualt-product-type.enum';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlanccoRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  getDefaultProductType() {
    const name = BlanccoDefaultProductType.NAME;
    return this.prisma.product_type.upsert({
      where: {
        name
      },
      create: {
        name,
        pindex: 50,
        is_public: false,
      },
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

  cteateDefaultProductType(params: Prisma.product_typeCreateArgs) {
    return this.prisma.product_type.create(params);
  }
}
