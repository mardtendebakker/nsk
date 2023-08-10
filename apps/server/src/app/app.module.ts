import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { CustomerModule } from '../customer/customer.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { SupplierModule } from '../supplier/supplier.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { SaleModule } from '../sale/sale.module';
import { PurchaseModule } from '../purchase/purchase.module';
import { ProductModule } from '../product/product.module';
import { RepairModule } from '../repair/repair.module';
import { FileModule } from '../file/file.module';
import { OrderStatusModule } from '../order-status/order-status.module';
import { CompanyModule } from '../company/company.module';
import { EmailModule } from '../email/email.module';
import { ProductTypeModule } from '../product-type/product-type.module';
import { ProductStatusModule } from '../product-status/product-status.module';
import { OrderModule } from '../order/order.module';
import { PickupModule } from '../pickup/pickup.module';
import { LogisticModule } from '../logistic/logistic.module';
import { AttributeModule } from '../attribute/attribute.module';
import { TaskModule } from '../task/task.module';
import { AdminUserModule } from '../admin/user/user.module';
import { PublicModule } from '../public/public.module';
import { SplitProductModule } from '../split-product/split-product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get<string>("COGNITO_USER_POOL_ID"),
          clientId: configService.get<string>("COGNITO_CLIENT_ID"),
          tokenUse: "id",
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    DashboardModule,
    CustomerModule,
    SupplierModule,
    SaleModule,
    PurchaseModule,
    ProductModule,
    RepairModule,
    FileModule,
    CompanyModule,
    OrderStatusModule,
    EmailModule,
    ProductTypeModule,
    ProductStatusModule,
    OrderModule,
    PickupModule,
    LogisticModule,
    AttributeModule,
    TaskModule,
    AdminUserModule,
    PublicModule,
    SplitProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
