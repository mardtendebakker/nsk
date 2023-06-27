import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AttributeRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findAll(params: Prisma.attributeFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const take = params.take ? params.take : 20;
    
    const submission = await this.prisma.$transaction([
      this.prisma.attribute.count({where}),
      this.prisma.attribute.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
  
  findOne(params: Prisma.attributeFindUniqueArgs) {
    
    return this.prisma.attribute.findUnique(params);
  }

  update(params: Prisma.attributeUpdateArgs) {

    return this.prisma.attribute.update(params);
  }

  delete(params: Prisma.attributeDeleteArgs) {

    return this.prisma.attribute.delete(params);
  }

  deleteAllProductTypes(id: number) {
    
    return this.prisma.product_type_attribute.deleteMany({
      where: { attribute_id: id }
    });
  }

  deleteAllOptions(id: number) {
    
    return this.prisma.attribute_option.deleteMany({
      where: { attribute_id: id }
    });
  }
}
