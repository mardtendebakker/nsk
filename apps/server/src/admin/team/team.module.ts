import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { TeamRepository } from './team.repository';

@Module({
  providers: [TeamService, PrismaService, TeamRepository],
  exports: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
