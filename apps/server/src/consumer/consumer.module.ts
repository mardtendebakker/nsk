import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerService } from './consumer.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { WebshopModule } from '../webshop/webshop.module';
import { SaleModule } from '../sale/sale.module';
import { ProductModule } from '../product/product.module';
import { EmailService } from '../email/email.service';
import { EmailSES } from '../email/email.ses';
import { PurchaseModule } from '../purchase/purchase.module';
import { PurchaseRepository } from '../purchase/purchase.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleService } from '../module/module.service';
import { ModuleRepository } from '../module/module.repository';

@Module({
  providers: [
    ConsumerService,
    ConfigService,
    EmailService,
    EmailSES,
    PurchaseRepository,
    PrismaService,
    ModuleService,
    ModuleRepository,
  ],
  imports: [
    RabbitMQModule,
    WebshopModule,
    SaleModule,
    ProductModule,
    PurchaseModule,
  ],
})
export class ConsumerModule {}
