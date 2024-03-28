import { product_type } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductTypeEntity implements product_type {
  @ApiProperty()
    id: number;

  @ApiProperty()
    name: string;

  @ApiPropertyOptional()
    pindex: number | null;

  @ApiPropertyOptional()
    comment: string | null;

  @ApiProperty()
    is_attribute: boolean;

  @ApiProperty()
    is_public: boolean;

  @ApiPropertyOptional()
    external_id: number | null;
}
