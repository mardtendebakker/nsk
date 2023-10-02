import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString, ValidateIf } from "class-validator";

export class PrismaOrderStatusCreateInputDto implements Prisma.order_statusCreateInput {
  @ApiProperty()
  @IsBoolean()
  @ValidateIf((_, value) => value !== undefined)
  is_sale: boolean;

  @ApiProperty()
  @IsBoolean()
  @ValidateIf((_, value) => value !== undefined)
  is_purchase: boolean;

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
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  mailbody?: string;

  @ApiPropertyOptional()
  aorder?: Prisma.aorderCreateNestedManyWithoutOrder_statusInput;
}
  