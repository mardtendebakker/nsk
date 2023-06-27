import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  private select: Prisma.taskSelect;

  constructor(protected readonly repository: TaskRepository) {
    this.select = {
      id: true,
      name: true,
      description: true,
      product_type_task: {
        select: {
          product_type_id: true
        }
      }
    };
  }

  async findAll(query: FindManyDto) {
    const { count, data } = await this.repository.findAll({
      ...query,
      select: this.select,
      where: {
        id: {
          in: query.ids
        },
        name: {
          contains: query.nameContains
        }
      }
    });

    return {
      count,
      data: data.map(task => ({
        ...Object.assign({}, task, { product_type_task: undefined }), // removing extra fileds
        productTypes: task.product_type_task.map((productTypeTask) => ({ id: productTypeTask.product_type_id })),
      }))
    }
  }

  async findOne(id: number) {
    const params: Prisma.taskFindUniqueArgs = {
      where: { id },
      select: this.select,
    };

    const task: Prisma.taskGetPayload<Record<'select', Prisma.taskSelect>> = await this.repository.findOne(params);

    return {
      ...Object.assign({}, task, { product_type_task: undefined }), // removing extra fileds
      productTypes: task.product_type_task.map((productTypeTask) => ({ id: productTypeTask.product_type_id })),
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const {
      productTypes,
      ...rest
    } = updateTaskDto;

    const productTypeCreate: Prisma.product_type_taskUncheckedCreateWithoutTaskInput[] =
      productTypes.map(productTypeId => ({ product_type_id: productTypeId }));

    await this.repository.deleteAllProductTypes(id);

    return this.repository.update({
      where: { id },
      data: {
        ...rest,
        product_type_task: { create: productTypeCreate },
      },
    });
  }
}
