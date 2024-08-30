import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebshopService } from './webshop.service';
import { FileModule } from '../file/file.module';

@Global()
@Module({
  providers: [
    ConfigService, WebshopService,
  ],
  imports: [HttpModule, FileModule],
  exports: [WebshopService],
})
export class WebshopModule {}
