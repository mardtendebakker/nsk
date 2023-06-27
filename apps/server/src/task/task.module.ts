import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { TaskController } from './task.controller';

@Module({
  providers: [TaskService, TaskRepository],
  controllers: [TaskController],
  imports: [PrismaModule]
})
export class TaskModule {}
