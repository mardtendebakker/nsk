import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaskRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService
  ) {}

  async findAll(params: Prisma.taskFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take <  maxQueryLimit ? params.take : maxQueryLimit;
    
    const submission = await this.prisma.$transaction([
      this.prisma.task.count({where}),
      this.prisma.task.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
  
  findOne(params: Prisma.taskFindUniqueArgs) {
    
    return this.prisma.task.findUnique(params);
  }

  update(params: Prisma.taskUpdateArgs) {

    return this.prisma.task.update(params);
  }

  create(params: Prisma.taskCreateArgs) {

    return this.prisma.task.create(params);
  }

  delete(params: Prisma.taskDeleteArgs) {

    return this.prisma.task.delete(params);
  }

  deleteAllProductTypes(id: number) {
    
    return this.prisma.product_type_task.deleteMany({
      where: { task_id: id }
    });
  }
}
