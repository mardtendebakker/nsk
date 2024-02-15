import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { VehicleResponseDto } from './dto/vehicle-response.dto';
import { PickupService } from '../calendar/pickup/pickup.service';
import { FindCalendarResponeDto } from '../calendar/dto/find-calendar-response.dto';

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
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get('/:licensePlate/today-pickups/')
  @ApiResponse({ type: FindCalendarResponeDto, isArray: true })
  findTodayPickupsByLicensePlate(@Param('licensePlate') licensePlate: string) {
    return this.pickupService.findTodayPickupsByLicensePlate(licensePlate);
  }
}
