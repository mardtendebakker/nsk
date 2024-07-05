import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MessagingService } from './messaging.service';
import { WebshopService } from '../webshop/webshop.service';
import { WebshopProductModule } from '../aproduct/webshopProduct/webshopProduct.module';

@Module({
  providers: [
    MessagingService,
    WebshopService,
  ],
  imports: [HttpModule, WebshopProductModule],
})
export class MessagingModule {
  constructor(private service: MessagingService) {
    service.consumeProductPublished();
    service.consumeWebshopOrderCreated();
  }
}
