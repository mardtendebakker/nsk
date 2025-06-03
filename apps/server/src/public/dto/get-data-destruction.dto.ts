import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class DataDestructionDto {
  @ApiProperty({ example: 4, description: 'The index of the Data Destruction' })
  @IsInt()
    id: number;

  @ApiProperty({ example: 'HDD wipe report', description: 'Description of the Data Destruction' })
  @IsString()
    description: string;
}
