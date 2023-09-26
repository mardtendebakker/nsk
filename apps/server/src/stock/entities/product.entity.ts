import { product } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityStatus } from '../../common/types/entity-status.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductEntity implements product {
  @ApiProperty()
  @Type(() => Number)
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  type_id: number | null;

  @ApiProperty()
  @Type(() => Number)
  location_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  status_id: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  owner_id: number | null;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  price: number | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  external_id: number | null;

  @ApiProperty()
  @ApiProperty({
    enum: EntityStatus,
    enumName: 'EntityStatus',
    default: EntityStatus.Active,
  })
  @IsEnum(EntityStatus)
  @Type(() => Number)
  entity_status: EntityStatus;
}
