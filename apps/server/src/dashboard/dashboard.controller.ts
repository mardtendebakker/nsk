import { Controller, Get, Param, Req } from '@nestjs/common';
import { IndexSearchDto } from './dashboard.dto';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get(':orderNumber/:type')
  indexSearch(@Param() indexSearchDto: IndexSearchDto) {
    return this.dashboardService.searchIndex(indexSearchDto)
  }
}
