import { Module } from '@nestjs/common';
import { LocationTemplateModule } from './location-template/location-template.module';
import { AdminUserModule } from './user/user.module';
import { OrderStatusModule } from './order-status/order-status.module';

@Module({
  imports: [
    AdminUserModule,
    OrderStatusModule,
    LocationTemplateModule,
  ]
})
export class AdminModule {}
