import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AOrder {
  @ApiPropertyOptional()
    status_id?: number;
}

export class UpdateManyAOrderDto {
  @ApiProperty()
  @IsNumber({}, { each: true })
    ids: number[];

  @ApiProperty()
    order: AOrder;
}
