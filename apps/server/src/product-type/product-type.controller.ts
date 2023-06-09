import { Authentication } from "@nestjs-cognito/auth";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductTypeService } from "./product-type.service";
import { FindProductTypesResponeDto } from "./dto/find-product-type-response.dto";
import { FindManyDto } from "./dto/find-many.dto";

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
}
