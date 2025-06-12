import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class DataDestructionDto {
  @ApiProperty({ example: 4, description: 'The index of the Data Destruction' })
  @IsInt()
    id: number;

  @ApiProperty({ example: 'Datadrager gecertificeerd wipen', description: 'The description of the Data Destruction' })
  @IsString()
    description: string;

  @ApiProperty({ example: 'Indien wipen niet lukt wordt de drager degaussed (EMP)', description: 'The extra information of the Data Destruction' })
  @IsString()
    extra: string;
}
