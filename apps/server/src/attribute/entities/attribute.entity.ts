import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { attribute } from '@prisma/client';

export class AttributeEntity implements attribute {
  @ApiProperty()
    id: number;

  @ApiPropertyOptional()
    product_type_filter_id: number | null;

  @ApiProperty()
    attr_code: string;

  @ApiProperty()
    name: string;

  @ApiPropertyOptional()
    price: number | null;

  @ApiPropertyOptional()
    type: number | null;

  @ApiProperty()
    has_quantity: boolean;

  @ApiPropertyOptional()
    external_id: number | null;

  @ApiProperty()
    is_public: boolean;
}
