import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TeamRepository {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async findAll(params: Prisma.teamFindManyArgs) {
    const {
      skip, cursor, where, select, orderBy,
    } = params;

    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take < maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.team.count({ where }),
      this.prisma.team.findMany({
        skip, take, cursor, where, select, orderBy,
      }),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  findOne(params: Prisma.teamFindFirstArgs) {
    return this.prisma.team.findFirst(params);
  }

  async delete(params: Prisma.teamDeleteArgs) {
    try {
      return await this.prisma.team.delete(params);
    } catch (err) {
      if (err.code === 'P2003') {
        throw new ConflictException();
      }

      throw err;
    }
  }

  find(params: Prisma.teamFindManyArgs) {
    return this.prisma.team.findMany(params);
  }

  create(params: Prisma.teamCreateArgs) {
    return this.prisma.team.create(params);
  }

  update(params: Prisma.teamUpdateArgs) {
    return this.prisma.team.update(params);
  }
}
