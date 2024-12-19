import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Group } from '../model/group.enum';

export class PatchDto {
  @ApiProperty()
  @IsArray()
    groups: Group[];
}
