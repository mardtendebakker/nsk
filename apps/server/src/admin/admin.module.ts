import { Module } from '@nestjs/common';
import { LocationTemplateModule } from './location-template/location-template.module';
import { AdminUserModule } from './user/user.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { LocationModule } from './location/location.module';
import { ProductStatusModule } from './product-status/product-status.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { ProductSubTypeModule } from './product-sub-type/product-sub-type.module';
import { ThemeModule } from './theme/theme.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [
    AdminUserModule,
    OrderStatusModule,
    ProductStatusModule,
    ProductTypeModule,
    ProductSubTypeModule,
    LocationModule,
    LocationTemplateModule,
    ThemeModule,
    TeamModule,
  ],
})
export class AdminModule {}
