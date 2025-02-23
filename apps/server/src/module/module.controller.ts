import {
  Body, Controller, Get, Param, Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ModuleService } from './module.service';
import { FindModuleResponseDto } from './dto/find-module-response.dto';

@ApiBearerAuth()
@ApiTags('modules')
@Controller('modules')
export class ModuleController {
  constructor(protected readonly moduleService: ModuleService) {}

  @Get('')
  @ApiResponse({ type: FindModuleResponseDto, isArray: true })
  findAll() {
    return this.moduleService.findAll();
  }

  @Put('/:id/configs')
  @ApiResponse({ type: FindModuleResponseDto })
  patchConfig(@Param('id') id: number, @Body() body: object) {
    return this.moduleService.setConfig(id, body);
  }
}
