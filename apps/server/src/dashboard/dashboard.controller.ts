import { Controller, ForbiddenException, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Authorization, CognitoUser } from '@nestjs-cognito/auth';
import { DashboardService } from './dashboard.service';
import { TotalCount } from './dto/total-count.dto';
import {
  ALL_MAIN_GROUPS, CognitoGroups, LOCAL_GROUPS, PARTNERS_GROUPS,
} from '../common/types/cognito-groups.enum';

@ApiBearerAuth()
@Authorization(ALL_MAIN_GROUPS)
@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(protected readonly dashboardService: DashboardService) {}

  @Get('total/count')
  @ApiResponse({ type: TotalCount })
  totalCount(
  @CognitoUser(['groups', 'email'])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    },
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.dashboardService.totalCount();
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.dashboardService.totalCount(email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }
}
