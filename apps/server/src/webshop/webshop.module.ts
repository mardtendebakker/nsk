import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebshopService } from './webshop.service';

@Global()
@Module({
  providers: [
    ConfigService, WebshopService,
  ],
  imports: [HttpModule],
  exports: [WebshopService],
})
export class WebshopModule {}
