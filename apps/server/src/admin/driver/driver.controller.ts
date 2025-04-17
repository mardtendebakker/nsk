import {
  Body, Controller, Delete, Get, Param, Post, Put, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindManyDto } from './dto/find-many.dto';
import { MANAGER_GROUPS } from '../../user/model/group.enum';
import { Authorization } from '../../security/decorator/authorization.decorator';
import { FindDriverResponeDto, FindDriversResponeDto } from './dto/find-driver-response.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { CreateDriverDto } from './dto/create-driver.dto';
import { DriverService } from './driver.service';

@ApiBearerAuth()
@Authorization(MANAGER_GROUPS)
@ApiTags('admin drivers')
@Controller('admin/drivers')
export class DriverController {
  constructor(protected readonly driverService: DriverService) {}

  @Get()
  @ApiResponse({ type: FindDriversResponeDto })
  findAll(@Query() query: FindManyDto) {
    return this.driverService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ type: FindDriverResponeDto })
  findOne(@Param('id') id: number) {
    return this.driverService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({ type: FindDriverResponeDto })
  update(@Param('id') id: number, @Body() body: UpdateDriverDto) {
    return this.driverService.update(id, body);
  }

  @Post()
  @ApiResponse({ type: FindDriverResponeDto })
  create(@Body() body: CreateDriverDto) {
    return this.driverService.create(body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.driverService.delete(id);
  }
}
