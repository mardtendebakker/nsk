import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductRepository } from './product.repository';
import { LocationModule } from '../admin/location/location.module';
import { FileModule } from '../file/file.module';
import { PrintService } from '../print/print.service';
import { EntityStatus } from '../common/types/entity-status.enum';
import { LocationLabelModule } from '../location-label/location-label.module';
import { BlanccoModule } from '../blancco/blancco.module';
import { ProductBlancco } from './product.blancco';

@Module({
  providers: [
    ProductService,
    ProductRepository,
    {
      provide: 'IS_REPAIR',
      useValue: false,
    },
    {
      provide: 'ENTITY_STATUS',
      useValue: EntityStatus.Active,
    },
    PrintService,
    ProductBlancco,
  ],
  controllers: [ProductController],
  imports: [
    PrismaModule,
    LocationModule,
    LocationLabelModule,
    FileModule,
    BlanccoModule,
  ],
  exports: [ProductService],
})
export class ProductModule {}
