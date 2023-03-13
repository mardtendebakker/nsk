import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductRepository } from './product.repository';

@Module({
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  imports: [PrismaModule]
})
export class ProductModule {}
