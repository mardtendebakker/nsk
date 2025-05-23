import {
  Body, Controller, Get, Param, Post, Put, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductStatusService } from './product-status.service';
import { FindProductStatusesResponeDto } from './dto/find-product-status-response.dto';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { ProductStatusEntity } from './entities/product-status.entity';
import { CreateProductStatusDto } from './dto/create-product-status.dto';
import { requiredModule } from '../../common/guard/required-modules.guard';
import { MANAGER_GROUPS } from '../../user/model/group.enum';
import { Authorization } from '../../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(MANAGER_GROUPS)
@ApiTags('admin product statuses')
@Controller('admin/product-statuses')
export class ProductStatusController {
  constructor(protected readonly productStatusService: ProductStatusService) {}

  @Get('')
  @ApiResponse({ type: FindProductStatusesResponeDto })
  findAll(@Query() query: FindManyDto) {
    return this.productStatusService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ type: ProductStatusEntity })
  @UseGuards(requiredModule('product_statuses'))
  findOne(@Param('id') id: number) {
    return this.productStatusService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({ type: ProductStatusEntity })
  @UseGuards(requiredModule('product_statuses'))
  update(@Param('id') id: number, @Body() updateProductStatusDto: UpdateProductStatusDto) {
    return this.productStatusService.update(id, updateProductStatusDto);
  }

  @Post()
  @ApiResponse({ type: ProductStatusEntity })
  @UseGuards(requiredModule('product_statuses'))
  create(@Body() createProductStatusDto: CreateProductStatusDto) {
    return this.productStatusService.create(createProductStatusDto);
  }
}
