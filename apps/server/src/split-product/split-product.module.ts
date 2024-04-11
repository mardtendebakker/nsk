import { Module } from '@nestjs/common';
import { SplitProductService } from './split-product.service';
import { SplitProductController } from './split-product.controller';
import { ProductModule } from '../product/product.module';
import { FileModule } from '../file/file.module';

@Module({
  providers: [SplitProductService],
  controllers: [SplitProductController],
  imports: [
    ProductModule,
    FileModule,
  ],
})
export class SplitProductModule {}
