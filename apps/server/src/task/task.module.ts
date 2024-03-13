import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { TaskController } from './task.controller';
import { ContactRepository } from '../contact/contact.repository';

@Module({
  providers: [TaskService, 
    TaskRepository,
    ContactRepository,
],
    
  controllers: [TaskController],
  imports: [PrismaModule],
  exports: [TaskService],
})
export class TaskModule {}
