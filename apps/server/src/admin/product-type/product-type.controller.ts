import { Authorization, AuthorizationGuard } from "@nestjs-cognito/auth";
import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductTypeService } from "./product-type.service";
import { FindProductTypesResponeDto } from "./dto/find-product-type-response.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { ProductTypeEntity } from "./entities/product-type.entity";
import { UpdateProductTypeDto } from "./dto/update-product-type.dto";
import { CreateProductTypeDto } from "./dto/create-product-type.dto";
import { INTERNAL_GROUPS, MANAGER_GROUPS } from "../../common/types/cognito-groups.enum";

@ApiBearerAuth()
@Authorization(INTERNAL_GROUPS)
@ApiTags('admin product types')
@Controller('admin/product-types')
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
  @UseGuards(AuthorizationGuard(MANAGER_GROUPS))
  @ApiResponse({type: ProductTypeEntity})
  update(@Param('id') id: number, @Body() updateProductTypeDto: UpdateProductTypeDto) {
    return this.productTypeService.update(id, updateProductTypeDto);
  }

  @Post()
  @UseGuards(AuthorizationGuard(MANAGER_GROUPS))
  @ApiResponse({type: ProductTypeEntity})
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    return this.productTypeService.create(createProductTypeDto);
  }
}
