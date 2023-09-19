import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LogisticRole } from './types/logistic-role.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LogisticRepository {
  constructor(
    private readonly prisma: PrismaService,
    protected readonly configService: ConfigService
  ) {}

  async findAll(params: Prisma.fos_userFindManyArgs) {
    const { skip, cursor, select, orderBy } = params;
    const where: Prisma.fos_userWhereInput = {
      ...params.where,
      roles: LogisticRole.LOGISTIC_ROLE
    };
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = isFinite(params.take) && params.take <  maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.fos_user.count({where}),
      this.prisma.fos_user.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  findOne(params: Prisma.fos_userFindUniqueArgs) {
    return this.prisma.fos_user.findUnique(params);
  }
}
