import { Controller, Get, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsResultDto } from './dto/analytics-result.dto';
import { AnalyticsDto } from './dto/analytics.dto';
import { Authentication } from '@nestjs-cognito/auth';

@ApiBearerAuth()
@Authentication()
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(protected readonly orderService: OrderService) {}

  @Get('analytics')
  @ApiResponse({type: AnalyticsResultDto})
  analytics(@Query() query: AnalyticsDto) {
    return this.orderService.analytics(query.groupby);
  }
}
