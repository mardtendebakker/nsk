import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    name: string;
}
