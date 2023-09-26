import { ApiPropertyOptional } from "@nestjs/swagger";
import { FindManyDto as BaseFindManyDto } from "../../common/dto/find-many.dto";
import { IsEnum, IsInt, IsOptional, IsString, ValidateIf } from "class-validator";
import { Type } from "class-transformer";
import { AOrderDiscrimination } from "../../aorder/types/aorder-discrimination.enum";
import { EntityStatus } from "../../common/types/entity-status.enum";

export class FindManyDto extends BaseFindManyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  productType?: number;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  productStatus?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  location?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orderId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  excludeByOrderId?: number;

  @ApiPropertyOptional({
    enum: AOrderDiscrimination,
    enumName: 'AOrderDiscrimination'
  })
  @IsOptional()
  @IsEnum(AOrderDiscrimination)
  @Type(() => String)
  excludeByOrderDiscr?: AOrderDiscrimination;
}
