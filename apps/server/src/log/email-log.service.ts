/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { EmailLogRepository } from './email-log.repository';

@Injectable()
export class EmailLogService {
  constructor(
    private repository: EmailLogRepository,
  ) {}

  findAll(query: FindManyDto) {
    const where: Prisma.email_logWhereInput = { };

    if (query.search) {
      where.OR = [
        { api_error: { contains: query.search } },
        { content: { contains: query.search } },
        { from: { contains: query.search } },
        { to: { contains: query.search } },
        { subject: { contains: query.search } },
      ];
    }

    return this.repository.findAll({ ...query, where, orderBy: { created_at: 'desc' } });
  }
}
