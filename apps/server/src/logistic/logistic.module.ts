import { Module } from '@nestjs/common';
import { LogisticService } from './logistic.service';
import { LogisticController } from './logistic.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LogisticRepository } from './logistic.repository';

@Module({
  providers: [LogisticService, LogisticRepository],
  controllers: [LogisticController],
  imports: [PrismaModule],
})
export class LogisticModule {}
