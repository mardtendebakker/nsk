import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class Product {
  @ApiPropertyOptional()
    location_id?: number;

  @ApiPropertyOptional()
    location_label?: string;
}

export class UpdateManyProductDto {
  @ApiProperty()
  @IsNumber({}, { each: true })
    ids: number[];

  @ApiProperty()
    product: Product;
}
