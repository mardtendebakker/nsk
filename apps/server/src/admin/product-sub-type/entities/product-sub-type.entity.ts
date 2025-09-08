import { product_sub_type } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductSubTypeEntity implements product_sub_type {
  @ApiProperty()
    id: number;

  @ApiProperty()
    product_type_id: number;

  @ApiProperty()
    name: string;

  @ApiPropertyOptional()
    magento_category_id: string | null;

  @ApiPropertyOptional()
    magento_attr_set_id: string | null;

  @ApiPropertyOptional()
    magento_group_spec_id: string | null;

  @ApiPropertyOptional()
    pindex: number | null;
}
