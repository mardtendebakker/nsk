import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductRepository } from './product.repository';
import { LocationModule } from '../location/location.module';
import { FileModule } from '../file/file.module';
import { PrintService } from '../print/print.service';

@Module({
  providers: [
    ProductService,
    ProductRepository,
    {
      provide: 'IS_REPAIR',
      useValue: false,
    },
    PrintService,
  ],
  controllers: [ProductController],
  imports: [PrismaModule, LocationModule, FileModule],
  exports: [ProductService],
})
export class ProductModule {}
