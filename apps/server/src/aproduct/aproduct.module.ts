import { Module } from '@nestjs/common';
import { AProductService } from './aproduct.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationModule } from '../location/location.module';
import { FileModule } from '../file/file.module';
import { AProductRepository } from './aproduct.repository';
import { AproductController } from './aproduct.controller';
import { PrintService } from '../print/print.service';
import { ArchivedModule } from './archived/archived.module';

@Module({
  providers: [
    AProductService,
    AProductRepository,
    {
      provide: 'ENTITY_STATUS',
      useValue: null,
    },
    PrintService
  ],
  controllers: [AproductController],
  imports: [PrismaModule, LocationModule, FileModule, ArchivedModule],
  exports: [AProductService],
})
export class AProductModule {}
