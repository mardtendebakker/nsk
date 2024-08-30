import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerService } from './consumer.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { WebshopModule } from '../webshop/webshop.module';
import { SaleModule } from '../sale/sale.module';
import { ProductModule } from '../product/product.module';

@Module({
  providers: [
    ConsumerService,
    ConfigService,
  ],
  imports: [
    RabbitMQModule,
    WebshopModule,
    SaleModule,
    ProductModule,
  ],
})
export class ConsumerModule {}
