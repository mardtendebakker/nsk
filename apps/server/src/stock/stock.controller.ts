import { Authentication } from "@nestjs-cognito/auth";
import { Get, Param, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { FindManyDto } from "../common/dto/find-many.dto";
import { FindOneProductResponeDto } from "./dto/find-one-product-response.dto";
import { FindProductsResponseDto } from "./dto/find-product-respone.dto";
import { StockService } from "./stock.service";

@ApiBearerAuth()
@Authentication()
export class StockController {
  constructor(protected readonly stockService: StockService) {}

  @Get('')
  @ApiResponse({isArray: true, type: FindProductsResponseDto})
  findAll(@Query() query: FindManyDto) {
    return this.stockService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({type: FindOneProductResponeDto})
  findOne(@Param('id') id: number) {
    return this.stockService.findOne({
      where: { id }
    });
  }
}
