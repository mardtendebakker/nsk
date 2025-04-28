import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async findAll(params: Prisma.userFindManyArgs) {
    const {
      skip, cursor, where, select, orderBy,
    } = params;

    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take < maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        skip, take, cursor, where, select, orderBy,
      }),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  findOne(params: Prisma.userFindFirstArgs) {
    return this.prisma.user.findFirst(params);
  }

  async delete(params: Prisma.userDeleteArgs) {
    try {
      return await this.prisma.user.delete(params);
    } catch (err) {
      if (err.code === 'P2003') {
        throw new ConflictException();
      }

      throw err;
    }
  }

  find(params: Prisma.userFindManyArgs) {
    return this.prisma.user.findMany(params);
  }

  create(params: Prisma.userCreateArgs) {
    return this.prisma.user.create(params);
  }

  update(params: Prisma.userUpdateArgs) {
    return this.prisma.user.update(params);
  }
}
