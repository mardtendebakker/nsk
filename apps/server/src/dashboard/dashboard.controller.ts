import {
  Controller, ForbiddenException, Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardTotal } from './dto/dashboard-total.dto';
import { ConnectedUser, ConnectedUserType } from '../security/decorator/connected-user.decorator';
import { ALL_MAIN_GROUPS, LOCAL_GROUPS, PARTNERS_GROUPS } from '../user/model/group.enum';
import { Authorization } from '../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(ALL_MAIN_GROUPS)
@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(protected readonly dashboardService: DashboardService) {}

  @Get('total')
  @ApiResponse({ type: DashboardTotal })
  total(
  @ConnectedUser()
    {
      groups,
      email,
    }: ConnectedUserType,
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.dashboardService.total();
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.dashboardService.total(email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }
}
