import {
  Controller, Get, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindManyDto } from './dto/find-many.dto';
import { LOGISTICS_GROUPS } from '../user/model/group.enum';
import { Authorization } from '../security/decorator/authorization.decorator';
import { EmailLogService } from './email-log.service';
import { FindEmailLogResponeDto } from './dto/find-email-log-response.dto';

@ApiBearerAuth()
@Authorization(LOGISTICS_GROUPS)
@ApiTags('Email logs')
@Controller('logs/emails')
export class EmailLogController {
  constructor(protected readonly emailLogService: EmailLogService) {}

  @Get()
  @ApiResponse({ type: FindEmailLogResponeDto })
  findAll(@Query() query: FindManyDto) {
    return this.emailLogService.findAll(query);
  }
}
