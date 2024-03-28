import { Authorization } from '@nestjs-cognito/auth';
import {
  Controller, Get, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PickupService } from './pickup.service';
import { FindPickupsResponeDto } from './dto/find-all-pickup-response.dto';
import { FindManyDto } from '../dto/find-many.dto';
import { LOCAL_GROUPS } from '../../common/types/cognito-groups.enum';
import { requiredModule } from '../../common/guard/required-modules.guard';

@ApiBearerAuth()
@Authorization(LOCAL_GROUPS)
@ApiTags('calendar-pickups')
@Controller('calendar/pickups')
export class PickupController {
  constructor(protected readonly pickupService: PickupService) {}

  @Get('')
  @ApiResponse({ type: FindPickupsResponeDto })
  @UseGuards(requiredModule('logistics'))
  findAll(@Query() query: FindManyDto) {
    return this.pickupService.findAll(query);
  }
}
