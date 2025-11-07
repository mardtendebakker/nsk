import { Injectable, ConflictException } from '@nestjs/common';
import { team } from '@prisma/client';
import { TeamModel } from './model/team.model';
import { FindManyDto } from './dto/find-many.dto';
import { TeamRepository } from './team.repository';
import { TeamResponseDto } from './dto/team-response.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(
    private teamRepository: TeamRepository,
  ) {
  }

  async findAll(query: FindManyDto) {
    const { search } = query;
    const { count, data } = await this.teamRepository.findAll({
      ...query,
      where: {
        ...(search && { name: { contains: search } }),
      },
    });

    return {
      count,
      data: data.map(this.formatDbTeamForList),
    };
  }

  async findOne(id: number) {
    const result = await this.teamRepository.findOne({ where: { id } });

    if (!result) {
      return null;
    }

    return this.formatDbTeam(result);
  }

  async create(createDto: CreateTeamDto) {
    const existingTeam = await this.teamRepository.findOne({ where: { name: createDto.name } });
    if (existingTeam) {
      throw new ConflictException('Team with this name already exists');
    }

    const result = await this.teamRepository.create({
      data: createDto,
    });

    return this.formatDbTeam(result);
  }

  async update(id: number, updateDto: UpdateTeamDto) {
    if (updateDto.name) {
      const existingTeam = await this.teamRepository.findOne({ 
        where: { 
          name: updateDto.name,
          NOT: { id }
        } 
      });
      if (existingTeam) {
        throw new ConflictException('Team with this name already exists');
      }
    }

    const result = await this.teamRepository.update({
      where: { id },
      data: updateDto,
    });

    return this.formatDbTeam(result);
  }

  async delete(id: number) {
    return this.teamRepository.delete({
      where: { id },
    });
  }

  private formatDbTeam(t: team): TeamModel {
    return {
      id: t.id,
      name: t.name,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    };
  }

  private formatDbTeamForList(t: team): TeamResponseDto {
    return {
      id: t.id,
      name: t.name,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    };
  }
}
