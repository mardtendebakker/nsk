import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { VehicleResponseDto } from './dto/vehicle-response.dto';
import { PickupService } from '../calendar/pickup/pickup.service';
import { FindCalendarResponeDto } from '../calendar/dto/find-calendar-response.dto';
import { requiredModule } from '../common/guard/required-modules.guard';

@ApiBearerAuth()
@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(
    protected readonly vehicleService: VehicleService,
    protected readonly pickupService: PickupService
  ) { }

  @Get('')
  @ApiResponse({ type: VehicleResponseDto, isArray: true })
  @UseGuards(requiredModule('tracking'))
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get('/:licensePlate/today-pickups/')
  @ApiResponse({ type: FindCalendarResponeDto, isArray: true })
  @UseGuards(requiredModule('tracking'))
  findTodayPickupsByLicensePlate(@Param('licensePlate') licensePlate: string) {
    return this.pickupService.findTodayPickupsByLicensePlate(licensePlate);
  }
}
