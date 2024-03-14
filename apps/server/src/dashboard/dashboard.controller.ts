import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { requiredModule } from '../common/guard/required-modules.guard';
import { TotalCount } from './dto/total-count.dto';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(protected readonly dashboardService: DashboardService) {}

  @Get('total/count')
  @ApiResponse({type: TotalCount })
  totalCount() {
    return this.dashboardService.totalCount();
  }
}
