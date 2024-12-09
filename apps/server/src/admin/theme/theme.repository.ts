import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ThemeRepository {
  constructor(
    private prisma: PrismaService,
  ) {
  }

  findOne() {
    return this.prisma.theme.findFirst({
      include: {
        favicon: true,
        logo: true,
      },
    });
  }

  update(params: Prisma.themeUpdateArgs) {
    return this.prisma.theme.update({
      ...params,
      include: {
        favicon: true,
        logo: true,
      },
    });
  }

  create(params: Prisma.themeCreateArgs) {
    return this.prisma.theme.create({
      ...params,
      include: {
        favicon: true,
        logo: true,
      },
    });
  }
}
