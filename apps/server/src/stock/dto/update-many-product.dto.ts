import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class Product {
  @ApiPropertyOptional()
    locationId?: number;

  @ApiPropertyOptional()
    locationLabel?: string;

  @ApiPropertyOptional()
    productTypeId?: number;

  @ApiPropertyOptional()
    entityStatus?: number;

  @ApiPropertyOptional()
    orderUpdatedAt?: Date;

  @ApiPropertyOptional()
    statusId?: number;

  @ApiPropertyOptional()
    price?: number;
}

export class UpdateManyProductDto {
  @ApiProperty()
  @IsNumber({}, { each: true })
    ids: number[];

  @ApiProperty()
    product: Product;
}
