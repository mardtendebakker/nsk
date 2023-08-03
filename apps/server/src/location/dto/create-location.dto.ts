import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  @Type(() => String)
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  zipcodes?: string;
}
