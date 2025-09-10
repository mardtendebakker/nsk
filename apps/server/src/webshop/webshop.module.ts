import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebshopService } from './webshop.service';
import { FileModule } from '../file/file.module';
import { AttributeModule } from '../attribute/attribute.module';
import { ProductTypeModule } from '../admin/product-type/product-type.module';
import { ProductSubTypeModule } from '../admin/product-sub-type/product-sub-type.module';

@Global()
@Module({
  providers: [
    ConfigService, WebshopService,
  ],
  imports: [
    HttpModule,
    FileModule,
    ProductTypeModule,
    ProductSubTypeModule,
    AttributeModule,
  ],
  exports: [WebshopService],
})
export class WebshopModule {}
