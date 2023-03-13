import { Authentication } from '@nestjs-cognito/auth';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindManyDto } from '../common/dto/find-many.dto';
import { FindProductsResponseDto } from './dto/find-product-respone.dto';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
@ApiBearerAuth()
@Authentication()
export class ProductController {
  constructor(protected readonly productService: ProductService) {}
  @Get('')
  @ApiResponse({isArray: true, type: FindProductsResponseDto})
  findAll(@Query() query: FindManyDto) {
    return this.productService.findAll(query);
  }
}
