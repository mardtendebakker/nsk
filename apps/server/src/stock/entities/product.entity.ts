import { product } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductEntity implements product {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  type_id: number | null;

  @ApiProperty()
  location_id: number;

  @ApiPropertyOptional()
  status_id: number | null;

  @ApiPropertyOptional()
  owner_id: number | null;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description: string | null;

  @ApiPropertyOptional()
  price: number | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiPropertyOptional()
  external_id: number | null;
}
