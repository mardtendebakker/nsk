import {
  Controller, Get, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { FindDeliveriesResponeDto } from './dto/find-delivery-response.dto';
import { FindManyDto } from '../dto/find-many.dto';
import { requiredModule } from '../../common/guard/required-modules.guard';
import { LOCAL_GROUPS } from '../../user/model/group.enum';
import { Authorization } from '../../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(LOCAL_GROUPS)
@ApiTags('calendar-deliveries')
@Controller('calendar/deliveries')
export class DeliveryController {
  constructor(protected readonly deliveryService: DeliveryService) {}

  @Get('')
  @ApiResponse({ type: FindDeliveriesResponeDto })
  @UseGuards(requiredModule('logistics'))
  findAll(@Query() query: FindManyDto) {
    return this.deliveryService.findAll(query);
  }
}
