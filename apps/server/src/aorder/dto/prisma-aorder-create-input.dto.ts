import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsString, ValidateIf } from "class-validator";
import { CreateCompanyDto } from "../../company/dto/create-company.dto";

export class PrismaAOrderCreateInputDto {
  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  order_nr?: string;

  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  remarks?: string;
  
  @ApiProperty()
  order_date: string | Date;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  discount?: number;
  
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  transport?: number;
  
  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ValidateIf((_, value) => value !== undefined)
  is_gift?: boolean;
  
  @ApiProperty()
  @IsString()
  discr: string;
  
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  external_id?: number;
  
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  delivery_type?: number;
  
  @ApiPropertyOptional()
  delivery_date?: string | Date;
  
  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  delivery_instructions?: string;
  
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  status_id?: number;
  
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  supplier_id?: number;

  @ApiPropertyOptional()
  @Type(() => CreateCompanyDto)
  supplier?: CreateCompanyDto;
  
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  customer_id?: number;

  @ApiPropertyOptional()
  @Type(() => CreateCompanyDto)
  customer?: CreateCompanyDto;
  
  @ApiPropertyOptional()
  afile?: Prisma.afileCreateNestedManyWithoutAorderInput;
  
  @ApiPropertyOptional()
  aorder?: Prisma.aorderCreateNestedOneWithoutOther_aorderInput;
  
  @ApiPropertyOptional()
  other_aorder?: Prisma.aorderCreateNestedManyWithoutAorderInput;
  
  @ApiPropertyOptional()
  pickup?: Prisma.pickupCreateNestedOneWithoutAorderInput;
  
  @ApiPropertyOptional()
  product_order?: Prisma.product_orderCreateNestedManyWithoutAorderInput;
  
  @ApiPropertyOptional()
  repair?: Prisma.repairCreateNestedOneWithoutAorderInput;
}