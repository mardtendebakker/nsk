import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class PrismaLocationTemplateCreateInputDto implements Prisma.location_templateUncheckedCreateInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  location_id: number;

  @ApiProperty()
  @IsString()
  template: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  pindex?: number;

  @ApiProperty()
  created_at: string | Date;

  @ApiProperty()
  updated_at: string | Date;
}
