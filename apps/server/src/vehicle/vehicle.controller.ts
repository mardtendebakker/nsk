import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { VehicleResponseDto } from './dto/vehicle-response.dto';

@ApiBearerAuth()
@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(protected readonly vehicleService: VehicleService) { }

  @Get('')
  @ApiResponse({ type: VehicleResponseDto, isArray: true })
  findAll() {
    return this.vehicleService.findAll();
  }
}
