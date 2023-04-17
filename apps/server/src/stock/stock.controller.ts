import { Authentication } from "@nestjs-cognito/auth";
import { Body, Get, Param, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { FindManyDto } from "../common/dto/find-many.dto";
import { FindOneProductResponeDto } from "./dto/find-one-product-response.dto";
import { FindProductsResponseDto } from "./dto/find-product-respone.dto";
import { StockService } from "./stock.service";
import { UpdateStockDto } from "./dto/update-stock.dto";

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

  @Put(':id')
  @ApiResponse({type: FindOneProductResponeDto})
  updateOne(@Param('id') id: number, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.updateOne({
      where: { id },
      data: updateStockDto
    });
  }
}
