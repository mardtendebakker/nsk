import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ExactService } from './exact.service';
import { ExactController } from './exact.controller';
import { ExactWebhookController } from './exact-webhook.controller';
import { ExactWebhookService } from './exact-webhook.service';
import { SaleRepository } from '../sale/sale.repository';
import { OrderStatusService } from '../admin/order-status/order-status.service';
import { OrderStatusRepository } from '../admin/order-status/order-status.repository';
import { PrismaService } from '../prisma/prisma.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    ExactService,
    ExactWebhookService,
    SaleRepository,
    OrderStatusService,
    OrderStatusRepository,
    PrismaService,
    ConfigService,
    {
      provide: 'IS_REPAIR',
      useValue: false,
    },
  ],
  controllers: [ExactController, ExactWebhookController],
  exports: [ExactService],
})
export class ExactModule {}
