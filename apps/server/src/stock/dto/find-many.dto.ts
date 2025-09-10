import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FindManyDto as BaseFindManyDto } from '../../common/dto/find-many.dto';
import { AOrderDiscrimination } from '../../aorder/types/aorder-discrimination.enum';
import { EntityStatus } from '../../common/types/entity-status.enum';

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
    locationLabel?: number;

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
    enumName: 'AOrderDiscrimination',
  })
  @IsOptional()
  @IsEnum(AOrderDiscrimination)
  @Type(() => String)
    excludeByOrderDiscr?: AOrderDiscrimination;

  @ApiPropertyOptional({
    enum: EntityStatus,
    enumName: 'EntityStatus',
  })
  @IsOptional()
  @IsEnum(EntityStatus)
  @Type(() => Number)
    entityStatus?: EntityStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === '1')
    inStockOnly?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === '1')
    outOfStockOnly?: boolean;
}
