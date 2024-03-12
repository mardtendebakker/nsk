import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [ModuleService],
  controllers: [ModuleController],
  imports: [PrismaModule]
})
export class ModuleModule {}
