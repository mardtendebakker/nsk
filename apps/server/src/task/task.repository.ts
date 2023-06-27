import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findAll(params: Prisma.taskFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const take = params.take ? params.take : 20;
    
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

  delete(params: Prisma.taskDeleteArgs) {

    return this.prisma.task.delete(params);
  }

  deleteAllProductTypes(id: number) {
    
    return this.prisma.product_type_task.deleteMany({
      where: { task_id: id }
    });
  }
}
