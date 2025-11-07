import {
  Body, Controller, Delete, Get, Param, Post, Put, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Authorization } from '../../security/decorator/authorization.decorator';
import { TeamService } from './team.service';
import { MANAGER_GROUPS } from '../../user/model/group.enum';
import { FindManyDto } from './dto/find-many.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { FindTeamsResponseDto } from './dto/find-teams-response.dto';
import { TeamEntity } from './entities/team.entity';

@ApiBearerAuth()
@Authorization(MANAGER_GROUPS)
@ApiTags('admin teams')
@Controller('admin/teams')
export class TeamController {
  constructor(protected readonly teamService: TeamService) {}

  @Get('')
  @ApiResponse({ type: FindTeamsResponseDto })
  findAll(@Query() query: FindManyDto) {
    return this.teamService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ type: TeamEntity })
  findOne(@Param('id') id: number) {
    return this.teamService.findOne(id);
  }

  @Post('')
  @ApiResponse({ type: TeamEntity })
  create(@Body() body: CreateTeamDto) {
    return this.teamService.create(body);
  }

  @Put(':id')
  @ApiResponse({ type: TeamEntity })
  update(@Param('id') id: number, @Body() body: UpdateTeamDto) {
    return this.teamService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.teamService.delete(id);
  }
}
