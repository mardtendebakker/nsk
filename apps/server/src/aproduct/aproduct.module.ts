import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AProductService } from './aproduct.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationModule } from '../admin/location/location.module';
import { FileModule } from '../file/file.module';
import { AProductRepository } from './aproduct.repository';
import { AproductController } from './aproduct.controller';
import { ArchivedModule } from './archived/archived.module';
import { LocationLabelModule } from '../location-label/location-label.module';
import { BlanccoModule } from '../blancco/blancco.module';
import { AProductBlancco } from './aproduct.blancco';
import { PrintModule } from '../print/print.module';
import { WebshopProductModule } from './webshopProduct/webshopProduct.module';

@Module({
  providers: [
    AProductService,
    AProductRepository,
    {
      provide: 'ENTITY_STATUS',
      useValue: null,
    },
    AProductBlancco,
  ],
  controllers: [AproductController],
  imports: [
    PrismaModule,
    LocationModule,
    LocationLabelModule,
    FileModule,
    ArchivedModule,
    WebshopProductModule,
    BlanccoModule,
    PrintModule,
    HttpModule,
  ],
  exports: [AProductService],
})
export class AProductModule {}
