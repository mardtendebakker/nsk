import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class SetupDto {
  @ApiProperty()
  @IsArray()
    moduleIds: number[];

  @ApiProperty()
  @IsString()
    redirectUrl: string;
}
