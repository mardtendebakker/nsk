import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [DashboardService],
  controllers: [DashboardController],
  imports: [PrismaModule]
})
export class DashboardModule {}
