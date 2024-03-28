import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DashboardRepository } from './dashboard.repository';

@Module({
  providers: [DashboardService, DashboardRepository],
  controllers: [DashboardController],
  imports: [PrismaModule],
})
export class DashboardModule {}
