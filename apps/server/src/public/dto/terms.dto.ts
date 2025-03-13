import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class TermsDto {
  @ApiProperty()
  @IsBoolean()
    reintegratie: string;

  @ApiProperty()
  @IsBoolean()
    afstand: boolean;

  @ApiProperty()
  @IsBoolean()
    levensstijl: boolean;

  @ApiProperty()
  @IsBoolean()
    resocialisatie: boolean;
}
