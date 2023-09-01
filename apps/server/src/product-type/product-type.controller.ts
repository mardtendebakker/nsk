import { Authentication } from "@nestjs-cognito/auth";
import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductTypeService } from "./product-type.service";
import { FindProductTypesResponeDto } from "./dto/find-product-type-response.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { ProductTypeEntity } from "./entities/product-type.entity";
import { UpdateProductTypeDto } from "./dto/update-product-type.dto";

@ApiBearerAuth()
@Authentication()
@ApiTags('product types')
@Controller('product-types')
export class ProductTypeController {
  constructor(protected readonly productTypeService: ProductTypeService) {}
  @Get('')
  @ApiResponse({type: FindProductTypesResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.productTypeService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({type: ProductTypeEntity})
  findOne(@Param('id') id: number) {
    return this.productTypeService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({type: ProductTypeEntity})
  update(@Param('id') id: number, @Body() updateProductTypeDto: UpdateProductTypeDto) {
    return this.productTypeService.update(id, updateProductTypeDto);
  }
}
