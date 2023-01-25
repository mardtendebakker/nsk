import { Module } from '@nestjs/common';
import { DashboardModule } from '../dashboard/dashboard.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
