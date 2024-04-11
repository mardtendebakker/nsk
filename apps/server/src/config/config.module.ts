import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { ModuleService } from '../module/module.service';
import { ModuleRepository } from '../module/module.repository';

@Module({
  providers: [ConfigService, ModuleService, ModuleRepository],
  controllers: [ConfigController],
  imports: [PrismaModule],
})
export class ConfigModule {}
