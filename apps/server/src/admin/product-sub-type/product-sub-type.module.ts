import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProductSubTypeService } from './product-sub-type.service';
import { ProductSubTypeRepository } from './product-sub-type.repository';
import { ProductSubTypeController } from './product-sub-type.controller';

@Module({
  providers: [ProductSubTypeService, ProductSubTypeRepository],
  controllers: [ProductSubTypeController],
  imports: [PrismaModule],
  exports: [ProductSubTypeService],
})
export class ProductSubTypeModule {}
