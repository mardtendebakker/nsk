import {
  Controller, Get, Query, UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from '@nestjs-cognito/auth';
import { OrderService } from './order.service';
import { AnalyticsResultDto } from './dto/analytics-result.dto';
import { AnalyticsDto } from './dto/analytics.dto';
import { AOrderController } from '../aorder/aorder.controller';
import { LOCAL_GROUPS } from '../common/types/cognito-groups.enum';

@ApiTags('orders')
@Controller('orders')
export class OrderController extends AOrderController {
  constructor(protected readonly orderService: OrderService) {
    super(orderService);
  }

  @Get('analytics')
  @UseGuards(AuthorizationGuard(LOCAL_GROUPS))
  @ApiResponse({ type: AnalyticsResultDto })
  analytics(@Query() query: AnalyticsDto) {
    return this.orderService.analytics(query.groupby);
  }
}
