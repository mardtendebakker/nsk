import {
  Controller, ForbiddenException, Get, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { AnalyticsResultDto } from './dto/analytics-result.dto';
import { AnalyticsDto } from './dto/analytics.dto';
import { AOrderController } from '../aorder/aorder.controller';
import { ALL_MAIN_GROUPS, LOCAL_GROUPS, PARTNERS_GROUPS } from '../user/model/group.enum';
import { ConnectedUser, ConnectedUserType } from '../security/decorator/connected-user.decorator';
import { Authorization } from '../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(ALL_MAIN_GROUPS)
@ApiTags('orders')
@Controller('orders')
export class OrderController extends AOrderController {
  constructor(protected readonly orderService: OrderService) {
    super(orderService);
  }

  @Get('analytics')
  @ApiResponse({ type: AnalyticsResultDto })
  analytics(
  @Query() query: AnalyticsDto,
    @ConnectedUser()
    {
      groups,
      email,
    }: ConnectedUserType,
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.orderService.analytics(query.groupby);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.orderService.analytics(query.groupby, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }
}
