import { ApiPropertyOptional } from "@nestjs/swagger";
import { FindManyDto as BaseFindManyDto } from "../../common/dto/find-many.dto";
import { IsInt, IsString, ValidateIf } from "class-validator";
import { Type } from "class-transformer";

export class FindManyDto extends BaseFindManyDto {
  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  search?: string;
  
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  productType?: number;
  
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  productStatus?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  location?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  orderId?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  orderIdExclude?: number;
}
