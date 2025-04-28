import {
  Body, Controller, Delete, Get, Param, Post, Put, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindManyDto } from './dto/find-many.dto';
import { MANAGER_GROUPS } from '../../user/model/group.enum';
import { Authorization } from '../../security/decorator/authorization.decorator';
import { FindVehicleResponeDto, FindVehiclesResponeDto } from './dto/find-vehicle-response.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleService } from './vehicle.service';

@ApiBearerAuth()
@Authorization(MANAGER_GROUPS)
@ApiTags('admin vehicles')
@Controller('admin/vehicles')
export class VehicleController {
  constructor(protected readonly vehicleService: VehicleService) {}

  @Get()
  @ApiResponse({ type: FindVehiclesResponeDto })
  findAll(@Query() query: FindManyDto) {
    return this.vehicleService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ type: FindVehicleResponeDto })
  findOne(@Param('id') id: number) {
    return this.vehicleService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({ type: FindVehicleResponeDto })
  update(@Param('id') id: number, @Body() body: UpdateVehicleDto) {
    return this.vehicleService.update(id, body);
  }

  @Post()
  @ApiResponse({ type: FindVehicleResponeDto })
  create(@Body() body: CreateVehicleDto) {
    return this.vehicleService.create(body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.vehicleService.delete(id);
  }
}
