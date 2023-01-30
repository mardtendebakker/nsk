import { Module } from '@nestjs/common';
import { DashboardModule } from '../dashboard/dashboard.module';
import { OrderModule } from '../order/order.module';
import { SupplierModule } from '../supplier/supplier.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DashboardModule,
    OrderModule,
    SupplierModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
