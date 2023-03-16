import { Authentication } from '@nestjs-cognito/auth';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindManyDto } from '../common/dto/find-many.dto';
import { FindOneProductResponeDto } from './dto/find-one-product-response.dto';
import { FindProductsResponseDto } from './dto/find-product-respone.dto';
import { ProductService } from './product.service';

@ApiTags('products')
@Controller('products')
@ApiBearerAuth()
@Authentication()
export class ProductController {
  constructor(protected readonly productService: ProductService) {}
  @Get('')
  @ApiResponse({isArray: true, type: FindProductsResponseDto})
  findAll(@Query() query: FindManyDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({type: FindOneProductResponeDto})
  findOne(@Param('id') id: number) {
    return this.productService.findOne({
      where: { id }
    });
  }
}
