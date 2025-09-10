import {
  Controller, ForbiddenException, Get,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardTotalDto } from './dto/dashboard-total.dto';
import { DashboardTotalResponseDto } from './dto/dashboard-total-response.dto';
import { ConnectedUser, ConnectedUserType } from '../security/decorator/connected-user.decorator';
import {
  ADMINS_GROUPS, ALL_MAIN_GROUPS, LOCAL_GROUPS, PARTNERS_GROUPS,
} from '../user/model/group.enum';
import { Authorization } from '../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(ALL_MAIN_GROUPS)
@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(protected readonly dashboardService: DashboardService) {}

  @Get('total')
  @Authorization(ADMINS_GROUPS)
  @ApiResponse({ type: DashboardTotalResponseDto })
  total(
  @Query() query: DashboardTotalDto,
    @ConnectedUser()
    {
      groups,
      email,
    }: ConnectedUserType,
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.dashboardService.total(query);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.dashboardService.total(query, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }
}
