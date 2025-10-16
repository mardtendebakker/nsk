import {
  Controller, Get, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindManyDto } from './dto/find-many.dto';
import { LOGISTICS_GROUPS } from '../user/model/group.enum';
import { Authorization } from '../security/decorator/authorization.decorator';
import { ActivityLogService } from './activity-log.service';
import { FindActivityLogResponseDto } from './dto/find-activity-log-response.dto';

@ApiBearerAuth()
@Authorization(LOGISTICS_GROUPS)
@ApiTags('Activity logs')
@Controller('logs/activities')
export class ActivityLogController {
  constructor(protected readonly activityLogService: ActivityLogService) {}

  @Get()
  @ApiResponse({ type: FindActivityLogResponseDto })
  findAll(@Query() query: FindManyDto) {
    return this.activityLogService.findAll(query);
  }
}
