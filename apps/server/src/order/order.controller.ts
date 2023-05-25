import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsResultDto } from './dto/analytics-result.dto';
import { AnalyticsDto } from './dto/analytics.dto';
import { Authentication } from '@nestjs-cognito/auth';
import { GetAllProductsByIdResponseDto } from './dto/find-all-products-by-id-response.dto';

@ApiBearerAuth()
@Authentication()
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(protected readonly orderService: OrderService) {}

  @Get(':id/products')
  @ApiResponse({isArray: true, type: GetAllProductsByIdResponseDto})
  getAllProductsById(@Param('id') id: number) {
    return this.orderService.getAllProductsById(id);
  }

  @Get('analytics')
  @ApiResponse({type: AnalyticsResultDto})
  analytics(@Query() query: AnalyticsDto) {
    return this.orderService.analytics(query.groupby);
  }
}
