import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductRepository } from './product.repository';
import { LocationModule } from '../location/location.module';

@Module({
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  imports: [PrismaModule, LocationModule]
})
export class ProductModule {}
