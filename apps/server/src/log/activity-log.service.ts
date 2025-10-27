import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { ActivityLogRepository } from './activity-log.repository';

@Injectable()
export class ActivityLogService {
  constructor(
    private repository: ActivityLogRepository,
  ) {}

  findAll(query: FindManyDto) {
    const where: Prisma.activity_logWhereInput = { };

    if (query.search) {
      where.OR = [
        { username: { contains: query.search } },
        { method: { contains: query.search } },
        { route: { contains: query.search } },
        { model: { contains: query.search } },
        { action: { contains: query.search } },
        { params: { contains: query.search } },
        { body: { contains: query.search } },
        { before: { contains: query.search } },
        { query: { contains: query.search } },
      ];
    }

    return this.repository.findAll({ ...query, where, orderBy: { createdAt: 'desc' } });
  }
}
