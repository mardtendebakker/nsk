import { Authentication } from "@nestjs-cognito/auth";
import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductStatusService } from "./product-status.service";
import { FindProductStatusesResponeDto } from "./dto/find-product-status-response.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { UpdateProductStatusDto } from "./dto/update-product-status.dto";
import { ProductStatusEntity } from "./entities/product-status.entity";

@ApiBearerAuth()
@Authentication()
@ApiTags('product statuses')
@Controller('product-statuses')
export class ProductStatusController {
  constructor(protected readonly productStatusService: ProductStatusService) {}
  @Get('')
  @ApiResponse({type: FindProductStatusesResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.productStatusService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({type: ProductStatusEntity})
  findOne(@Param('id') id: number) {
    return this.productStatusService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({type: ProductStatusEntity})
  update(@Param('id') id: number, @Body() updateProductStatusDto: UpdateProductStatusDto) {
    return this.productStatusService.update(id, updateProductStatusDto);
  }
}
