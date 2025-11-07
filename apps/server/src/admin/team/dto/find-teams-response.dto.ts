import { ApiProperty } from '@nestjs/swagger';
import { TeamResponseDto } from './team-response.dto';

export class FindTeamsResponseDto {
  @ApiProperty()
    count: number;

  @ApiProperty({ type: [TeamResponseDto] })
    data: TeamResponseDto[];
}
