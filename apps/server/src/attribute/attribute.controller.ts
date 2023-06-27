import { Authentication } from "@nestjs-cognito/auth";
import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AttributeService } from "./attribute.service";
import { FindAttributeResponseDto, FindAttributesResponeDto } from "./dto/find-attribute-response.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { AttributeEntity } from "./entities/attribute.entity";
import { UpdateAttributeDto } from "./dto/update-attribute.dto";

@ApiBearerAuth()
@Authentication()
@ApiTags('attributes')
@Controller('attributes')
export class AttributeController {
  constructor(protected readonly attributeService: AttributeService) {}
  @Get('')
  @ApiResponse({type: FindAttributesResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.attributeService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({type: FindAttributeResponseDto})
  findOne(@Param('id') id: number) {
    return this.attributeService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({type: AttributeEntity})
  update(@Param('id') id: number, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributeService.update(id, updateAttributeDto);
  }
}
