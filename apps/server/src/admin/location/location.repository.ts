import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LocationRepository {
  constructor(
    private readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {}

  getAll() {
    return this.prisma.location.findMany();
  }

  create(data: Prisma.locationCreateInput) {
    return this.prisma.location.create({
      data,
    });
  }

  findOne(params: Prisma.locationFindUniqueArgs) {
    const { where, select, include } = params;
    if (include) {
      return this.prisma.location.findUnique({ where, include });
    }
    return this.prisma.location.findUnique({ where, select });
  }

  update(params: {
    where: Prisma.locationWhereUniqueInput;
    data: Prisma.locationUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.location.update({
      data,
      where,
    });
  }

  async findAll(params: Prisma.locationFindManyArgs) {
    const {
      skip, cursor, where, select, orderBy,
    } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take < maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.location.count({ where }),
      this.prisma.location.findMany({
        skip, take, cursor, where, select, orderBy,
      }),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
}
