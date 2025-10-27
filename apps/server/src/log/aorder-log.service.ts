import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { AorderLogRepository } from './aorder-log.repository';

@Injectable()
export class AorderLogService {
  constructor(
    private repository: AorderLogRepository,
  ) {}

  findAll(query: FindManyDto) {
    const where: Prisma.aorder_logWhereInput = { };

    if (query.search) {
      where.OR = [
        { username: { contains: query.search } },
        { previous_status: { name: { contains: query.search } } },
        { status: { name: { contains: query.search } } },
      ];
    }

    return this.repository.findAll({ ...query, where, orderBy: { created_at: 'desc' } });
  }

  create(data: Prisma.aorder_logCreateInput) {
    return this.repository.create({ data });
  }
}
