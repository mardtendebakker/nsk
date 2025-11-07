import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateTeamDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
    name?: string;
}
