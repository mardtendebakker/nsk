import {
  Body, Controller, Get, Param, Post, Put, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductSubTypeService } from './product-sub-type.service';
import { FindProductSubTypesResponeDto } from './dto/find-product-sub-type-response.dto';
import { FindManyDto } from './dto/find-many.dto';
import { ProductSubTypeEntity } from './entities/product-sub-type.entity';
import { UpdateProductSubTypeDto } from './dto/update-product-sub-type.dto';
import { CreateProductSubTypeDto } from './dto/create-product-sub-type.dto';
import { LOCAL_GROUPS, MANAGER_GROUPS } from '../../user/model/group.enum';
import { Authorization } from '../../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(LOCAL_GROUPS)
@ApiTags('admin product sub types')
@Controller('admin/product-sub-types')
export class ProductSubTypeController {
  constructor(protected readonly productSubTypeService: ProductSubTypeService) {}

  @Get('')
  @ApiResponse({ type: FindProductSubTypesResponeDto })
  findAll(@Query() query: FindManyDto) {
    return this.productSubTypeService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ type: ProductSubTypeEntity })
  findOne(@Param('id') id: number) {
    return this.productSubTypeService.findOne(id);
  }

  @Put(':id')
  @Authorization(MANAGER_GROUPS)
  @ApiResponse({ type: ProductSubTypeEntity })
  update(@Param('id') id: number, @Body() updateProductSubTypeDto: UpdateProductSubTypeDto) {
    return this.productSubTypeService.update(id, updateProductSubTypeDto);
  }

  @Post()
  @Authorization(MANAGER_GROUPS)
  @ApiResponse({ type: ProductSubTypeEntity })
  create(@Body() createProductSubTypeDto: CreateProductSubTypeDto) {
    return this.productSubTypeService.create(createProductSubTypeDto);
  }
}
