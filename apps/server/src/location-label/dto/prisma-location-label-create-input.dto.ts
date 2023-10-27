import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class PrismaLocationLabelCreateInputDto implements Prisma.location_labelUncheckedCreateInput {
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
  label: string;

  @ApiProperty()
  created_at: string | Date;

  @ApiProperty()
  updated_at: string | Date;

  product?: Prisma.productUncheckedCreateNestedManyWithoutLocation_labelInput;
}
