import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

export class BlanccoRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {}

  findFirst(params: Prisma.product_typeFindFirstArgs) {
    return this.prisma.product_type.findFirst(params);
  }

  cteateDefaultProductType(params: Prisma.product_typeCreateArgs) {
    return this.prisma.product_type.create(params);
  }
}
