import { Module } from '@nestjs/common';
import { LocationTemplateModule } from './location-template/location-template.module';
import { AdminUserModule } from './user/user.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { LocationModule } from './location/location.module';
import { ProductStatusModule } from './product-status/product-status.module';
import { ProductTypeModule } from './product-type/product-type.module';

@Module({
  imports: [
    AdminUserModule,
    OrderStatusModule,
    ProductStatusModule,
    ProductTypeModule,
    LocationModule,
    LocationTemplateModule,
  ],
})
export class AdminModule {}
