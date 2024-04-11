import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ModuleRepository } from './module.repository';

@Module({
  providers: [ModuleService, ModuleRepository],
  controllers: [ModuleController],
  imports: [PrismaModule],
})
export class ModuleModule {}
