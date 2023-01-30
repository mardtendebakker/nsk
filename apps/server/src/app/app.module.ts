import { Module } from '@nestjs/common';
import { DashboardModule } from '../dashboard/dashboard.module';
import { OrderModule } from '../order/order.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DashboardModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
