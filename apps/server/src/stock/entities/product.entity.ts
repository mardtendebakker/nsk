import { product, stock } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { EntityStatus } from '../../common/types/entity-status.enum';

export class Stock implements stock {
  @ApiProperty()
  @Type(() => Number)
    id: number;

  @ApiProperty()
  @Type(() => Number)
    product_id: number;
}

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
    location_label_id: number | null;

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
    order_updated_at: Date | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
    external_id: number | null;

  @ApiProperty({
    enum: EntityStatus,
    enumName: 'EntityStatus',
    default: EntityStatus.Active,
  })
  @IsEnum(EntityStatus)
  @Type(() => Number)
    entity_status: EntityStatus;

  @ApiProperty()
  @Type(() => Stock)
    stock: Stock;
}
