import {
  Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AttributeService } from './attribute.service';
import { FindAttributeResponseDto, FindAttributesResponeDto } from './dto/find-attribute-response.dto';
import { FindManyDto } from './dto/find-many.dto';
import { AttributeEntity } from './entities/attribute.entity';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { requiredModule } from '../common/guard/required-modules.guard';
import { LOCAL_GROUPS } from '../user/model/group.enum';
import { Authorization } from '../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(LOCAL_GROUPS)
@ApiTags('attributes')
@Controller('attributes')
export class AttributeController {
  constructor(protected readonly attributeService: AttributeService) {}

  @Get('')
  @ApiResponse({ type: FindAttributesResponeDto })
  findAll(@Query() query: FindManyDto) {
    return this.attributeService.findAll(query);
  }

  @Get(':id')
  @UseGuards(requiredModule('attributes'))
  @ApiResponse({ type: FindAttributeResponseDto })
  findOne(@Param('id') id: number) {
    return this.attributeService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({ type: AttributeEntity })
  @UseGuards(requiredModule('attributes'))
  update(@Param('id') id: number, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributeService.update(id, updateAttributeDto);
  }

  @Post('')
  @ApiResponse({ type: AttributeEntity })
  @UseGuards(requiredModule('attributes'))
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributeService.create(createAttributeDto);
  }

  @Delete(':id')
  @UseGuards(requiredModule('attributes'))
  delete(@Param('id') id: number) {
    return this.attributeService.delete(id);
  }
}
