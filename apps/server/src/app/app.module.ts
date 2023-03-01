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
    PurchaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
