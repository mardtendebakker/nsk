import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlanccoRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  findOrCreateProductType(data: Prisma.product_typeCreateInput) {
    return this.prisma.product_type.upsert({
      where: {
        name: data.name,
      },
      create: data,
      update: {},
    });
  }

  findOrCreateAttribute(data: Prisma.attributeCreateInput) {
    return this.prisma.attribute.upsert({
      where: { name: data.name },
      create: data,
      update: { attr_code: data.attr_code },
    });
  }

  findOrCreateProductTypeAttribute(data: Prisma.product_type_attributeUncheckedCreateInput) {
    return this.prisma.product_type_attribute.upsert({
      where: { product_type_id_attribute_id: { ...data } },
      create: data,
      update: {},
    });
  }

  findFirst(params: Prisma.product_typeFindFirstArgs) {
    return this.prisma.product_type.findFirst(params);
  }
}
