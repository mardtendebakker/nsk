import {
  Controller, Get, Param, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogisticService } from './logistic.service';
import { FindLogisticResponeDto, FindLogisticsResponeDto } from './dto/find-logistic-response.dto';
import { FindManyDto } from './dto/find-many.dto';
import { LOGISTICS_GROUPS } from '../user/model/group.enum';
import { Authorization } from '../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(LOGISTICS_GROUPS)
@ApiTags('logistics')
@Controller('logistics')
export class LogisticController {
  constructor(protected readonly logisticService: LogisticService) {}

  @Get('')
  @ApiResponse({ type: FindLogisticsResponeDto })
  findAll(@Query() query: FindManyDto) {
    return this.logisticService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ type: FindLogisticResponeDto })
  findOne(@Param('id') id: number) {
    return this.logisticService.findOne(id);
  }
}
