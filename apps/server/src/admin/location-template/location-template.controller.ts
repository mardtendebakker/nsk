import { Authorization } from '@nestjs-cognito/auth';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationTemplateService } from './location-template.service';
import { FindLocationTemplatesResponeDto } from './dto/find-location-template-response.dto';
import { FindManyDto } from './dto/find-many.dto';
import { LocationTemplateEntity } from './entities/location-template.entity';
import { CreateLocationTemplateDto } from './dto/create-location-template.dto';
import { UpdateLocationTemplateDto } from './dto/update-location-template.dto';
import { MANAGER_GROUPS } from '../../common/types/cognito-groups.enum';

@ApiBearerAuth()
@Authorization(MANAGER_GROUPS)
@ApiTags('admin location template')
@Controller('admin/location-template')
export class LocationTemplateController {
  constructor(protected readonly location_templateService: LocationTemplateService) {}

  @Get('')
  @ApiResponse({type: FindLocationTemplatesResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.location_templateService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({type: LocationTemplateEntity})
  findOne(@Param('id') id: number) {
    return this.location_templateService.findOne(id);
  }

  @Post('')
  @ApiResponse({type: LocationTemplateEntity})
  create(@Body() createLocationTemplateDto: CreateLocationTemplateDto) {
    return this.location_templateService.create(createLocationTemplateDto);
  }

  @Put(':id')
  @ApiResponse({type: LocationTemplateEntity})
  update(@Param('id') id: number, @Body() updateLocationTemplateDto: UpdateLocationTemplateDto) {
    return this.location_templateService.update(id, updateLocationTemplateDto);
  }
  
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.location_templateService.delete(id);
  }
}
