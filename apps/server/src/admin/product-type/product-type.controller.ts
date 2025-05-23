import {
  Body, Controller, Get, Param, Post, Put, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductTypeService } from './product-type.service';
import { FindProductTypesResponeDto } from './dto/find-product-type-response.dto';
import { FindManyDto } from './dto/find-many.dto';
import { ProductTypeEntity } from './entities/product-type.entity';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { LOCAL_GROUPS, MANAGER_GROUPS } from '../../user/model/group.enum';
import { Authorization } from '../../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(LOCAL_GROUPS)
@ApiTags('admin product types')
@Controller('admin/product-types')
export class ProductTypeController {
  constructor(protected readonly productTypeService: ProductTypeService) {}

  @Get('')
  @ApiResponse({ type: FindProductTypesResponeDto })
  findAll(@Query() query: FindManyDto) {
    return this.productTypeService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ type: ProductTypeEntity })
  findOne(@Param('id') id: number) {
    return this.productTypeService.findOne(id);
  }

  @Put(':id')
  @Authorization(MANAGER_GROUPS)
  @ApiResponse({ type: ProductTypeEntity })
  update(@Param('id') id: number, @Body() updateProductTypeDto: UpdateProductTypeDto) {
    return this.productTypeService.update(id, updateProductTypeDto);
  }

  @Post()
  @Authorization(MANAGER_GROUPS)
  @ApiResponse({ type: ProductTypeEntity })
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    return this.productTypeService.create(createProductTypeDto);
  }
}
