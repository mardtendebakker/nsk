import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean, IsNumber, IsOptional, IsString,
} from 'class-validator';

export class PrismaOrderStatusCreateInputDto implements Prisma.order_statusCreateInput {
  @ApiProperty()
  @IsBoolean()
    is_purchase: boolean;

  @ApiProperty()
  @IsBoolean()
    is_sale: boolean;

  @ApiProperty()
  @IsBoolean()
    is_repair: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
    pindex?: number;

  @ApiProperty()
  @IsString()
    name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
    color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
    mailbody?: string;

  @ApiPropertyOptional()
  @IsOptional()
    aorder?: Prisma.aorderCreateNestedManyWithoutOrder_statusInput;
}
