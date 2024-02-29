import { Module } from '@nestjs/common';
import { AProductService } from './aproduct.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationModule } from '../admin/location/location.module';
import { FileModule } from '../file/file.module';
import { AProductRepository } from './aproduct.repository';
import { AproductController } from './aproduct.controller';
import { PrintService } from '../print/print.service';
import { ArchivedModule } from './archived/archived.module';
import { LocationLabelModule } from '../location-label/location-label.module';
import { BlanccoModule } from '../blancco/blancco.module';
import { AProductBlancco } from './aproduct.blancco';

@Module({
  providers: [
    AProductService,
    AProductRepository,
    {
      provide: 'ENTITY_STATUS',
      useValue: null,
    },
    PrintService,
    AProductBlancco,
  ],
  controllers: [AproductController],
  imports: [
    PrismaModule,
    LocationModule,
    LocationLabelModule,
    FileModule,
    ArchivedModule,
    BlanccoModule,
  ],
  exports: [AProductService],
})
export class AProductModule {}
