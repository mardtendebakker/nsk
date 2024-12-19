import {
  Body, Controller, Get, Param, Post, Put, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { FindLocationResponeDto, FindLocationsResponeDto } from './dto/find-location-response.dto';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { MANAGER_GROUPS } from '../../user/model/group.enum';
import { Authorization } from '../../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(MANAGER_GROUPS)
@ApiTags('admin locations')
@Controller('admin/locations')
export class LocationController {
  constructor(protected readonly locationService: LocationService) {}

  @Get()
  @ApiResponse({ type: FindLocationsResponeDto })
  findAll(@Query() query: FindManyDto) {
    return this.locationService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ type: FindLocationResponeDto })
  findOne(@Param('id') id: number) {
    return this.locationService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({ type: FindLocationResponeDto })
  update(@Param('id') id: number, @Body() body: UpdateLocationDto) {
    return this.locationService.update(id, body);
  }

  @Post()
  @ApiResponse({ type: FindLocationResponeDto })
  create(@Body() body: CreateLocationDto) {
    return this.locationService.create(body);
  }
}
