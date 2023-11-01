import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString, ValidateIf } from "class-validator";

export class PrismaProductStatusCreateInputDto implements Prisma.product_statusCreateInput {
  @ApiProperty()
  @IsBoolean()
  @ValidateIf((_, value) => value !== undefined)
  is_stock?: boolean;

  @ApiProperty()
  @IsBoolean()
  @ValidateIf((_, value) => value !== undefined)
  is_saleable?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  pindex?: number;

  @ApiProperty()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  color?: string;

  @ApiPropertyOptional()
  product?: Prisma.productCreateNestedManyWithoutProduct_statusInput;
}
  