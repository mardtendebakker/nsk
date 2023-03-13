import { product } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductEntity implements Partial<product> {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  type_id?: number;

  @ApiProperty()
  location_id: number;

  @ApiPropertyOptional()
  status_id?: number;

  @ApiPropertyOptional()
  owner_id?: number;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  price?: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiPropertyOptional()
  external_id?: number;
}
