import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProductTypeService } from './product-type.service';
import { ProductTypeRepository } from './product-type.repository';
import { ProductTypeController } from './product-type.controller';

@Module({
  providers: [ProductTypeService, ProductTypeRepository],
  controllers: [ProductTypeController],
  imports: [PrismaModule],
})
export class ProductTypeModule {}
