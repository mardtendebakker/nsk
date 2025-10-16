import {
  Controller, Get, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindManyDto } from './dto/find-many.dto';
import { LOGISTICS_GROUPS } from '../user/model/group.enum';
import { Authorization } from '../security/decorator/authorization.decorator';
import { AorderLogService } from './aorder-log.service';
import { FindAorderLogsResponseDto } from './dto/find-aorder-log-response.dto';

@ApiBearerAuth()
@Authorization(LOGISTICS_GROUPS)
@ApiTags('Aorder logs')
@Controller('logs/aorders')
export class AorderLogController {
  constructor(protected readonly aorderLogService: AorderLogService) {}

  @Get()
  @ApiResponse({ type: FindAorderLogsResponseDto })
  findAll(@Query() query: FindManyDto) {
    return this.aorderLogService.findAll(query);
  }
}

