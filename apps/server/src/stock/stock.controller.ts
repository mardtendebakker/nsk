import { Authentication } from "@nestjs-cognito/auth";
import { Body, Delete, Get, Param, Patch, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { FindOneProductResponeDto } from "./dto/find-one-product-response.dto";
import { FindProductsResponseDto } from "./dto/find-product-respone.dto";
import { StockService } from "./stock.service";
import { UpdateBodyStockDto } from "./dto/update-body-stock.dto";
import { UpdateManyResponseProductDto } from "./dto/update-many-product-response.dts";
import { UpdateManyProductDto } from "./dto/update-many-product.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { CreateBodyStockDto } from "./dto/create-body-stock.dto";

@ApiBearerAuth()
@Authentication()
export class StockController {
  constructor(protected readonly stockService: StockService) {}

  @Get('')
  @ApiResponse({type: FindProductsResponseDto})
  findAll(@Query() query: FindManyDto) {
    return this.stockService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({type: FindOneProductResponeDto})
  findOne(@Param('id') id: number) {
    return this.stockService.findOneCustomSelect(id);
  }

  @Post('')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiResponse({type: FindOneProductResponeDto})
  create(
    @Body() body: CreateBodyStockDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.stockService.create(body, files);
  }

  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiResponse({type: FindOneProductResponeDto})
  updateOne(
    @Param('id') id: number,
    @Body() body: UpdateBodyStockDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.stockService.updateOne(id, body, files);
  }

  @Patch('')
  @ApiResponse({type: UpdateManyResponseProductDto})
  updateMany(@Body() updateManyProductDto: UpdateManyProductDto) {
    return this.stockService.updateMany(updateManyProductDto)
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number) {
    return this.stockService.deleteOne(id);
  }
}
