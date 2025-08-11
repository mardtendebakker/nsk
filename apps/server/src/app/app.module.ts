import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CognitoAuthModule } from '@nestjs-cognito/auth';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ClsModule } from 'nestjs-cls';
import { DashboardModule } from '../dashboard/dashboard.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { SaleModule } from '../sale/sale.module';
import { PurchaseModule } from '../purchase/purchase.module';
import { ProductModule } from '../product/product.module';
import { ToRepairModule } from '../to-repair/to-repair.module';
import { FileModule } from '../file/file.module';
import { ContactModule } from '../contact/contact.module';
import { EmailModule } from '../email/email.module';
import { OrderModule } from '../order/order.module';
import { PickupModule } from '../calendar/pickup/pickup.module';
import { DeliveryModule } from '../calendar/delivery/delivery.module';
import { LogisticModule } from '../logistic/logistic.module';
import { AttributeModule } from '../attribute/attribute.module';
import { TaskModule } from '../task/task.module';
import { PublicModule } from '../public/public.module';
import { SplitProductModule } from '../split-product/split-product.module';
import { RepairModule } from '../repair/repair.module';
import { AProductModule } from '../aproduct/aproduct.module';
import { SalesServiceModule } from '../sales-service/sales-service.module';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';
import { AdminModule } from '../admin/admin.module';
import { CompanyModule } from '../company/company.module';
import { BlanccoModule } from '../blancco/blancco.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { FleetGoModule } from '../fleet-go/fleet-go.module';
import { ModuleModule } from '../module/module.module';
import { PaymentModule } from '../payment/payment.module';
import { ModulePaymentModule } from '../module-payment/module-payment.module';
import { ConfigModule as MyConfigModule } from '../config/config.module';
import { ConsumerModule } from '../consumer/consumer.module';
import { SecurityModule } from '../security/security.module';
import { VehicleAdminModule } from '../admin/vehicle/vehicle.module';
import { DriverAdminModule } from '../admin/driver/driver.module';
import { LogModule } from '../log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
      load: [
        () => ({
          MAX_RELATION_QUERY_LIMIT: process.env.MAX_RELATION_QUERY_LIMIT || 100,
          MAX_NONE_RELATION_QUERY_LIMIT: process.env.MAX_NONE_RELATION_QUERY_LIMIT || 5000,
          RABBITMQ_MAGENTO_PAYMENT_PAID: process.env.RABBITMQ_MAGENTO_PAYMENT_PAID || 'magento_payment_paid',
          RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_QUEUE: process.env.RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_QUEUE || 'purchase_order_status_updated',
          RABBITMQ_EXCHANGE: process.env.RABBITMQ_EXCHANGE || 'nexxus',
          RABBITMQ_DELAY_PURCHASE_ORDER_STATUS_UPDATED_QUEUE: process.env.RABBITMQ_DELAY_PURCHASE_ORDER_STATUS_UPDATED_QUEUE || 'delay_purchase_order_status_updated',
          RABBITMQ_DELAY_EXCHANGE: process.env.RABBITMQ_DELAY_EXCHANGE || 'delay_nexxus',
          RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_ROUTING_KEY: process.env.RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_ROUTING_KEY || 'purchase_order_status_updated_rk',
          RABBITMQ_NEXXUS_PRODUCT_CREATED_QUEUE: process.env.RABBITMQ_NEXXUS_PRODUCT_CREATED_QUEUE || 'nexxus_product_created',
        }),
      ],
    }),
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get<string>('COGNITO_USER_POOL_ID'),
          clientId: configService.get<string>('COGNITO_CLIENT_ID'),
          tokenUse: 'id',
        },
      }),
      inject: [ConfigService],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    ScheduleModule.forRoot(),
    UserModule,
    DashboardModule,
    PurchaseModule,
    SaleModule,
    RepairModule,
    ProductModule,
    ToRepairModule,
    SplitProductModule,
    FileModule,
    ContactModule,
    EmailModule,
    OrderModule,
    PickupModule,
    DeliveryModule,
    LogisticModule,
    AttributeModule,
    TaskModule,
    PublicModule,
    AProductModule,
    SalesServiceModule,
    AutocompleteModule,
    AdminModule,
    CompanyModule,
    BlanccoModule,
    FleetGoModule,
    VehicleModule,
    ModuleModule,
    PaymentModule,
    ModulePaymentModule,
    MyConfigModule,
    HttpModule,
    ConsumerModule,
    SecurityModule,
    VehicleAdminModule,
    DriverAdminModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
