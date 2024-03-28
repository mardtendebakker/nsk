import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class BulkPrintDTO {
  @Transform(({ value }) => (Array.isArray(value) ? value.map((id: string) => parseInt(id)) : parseInt(value)))
  @IsNumber({}, { each: true })
  @ApiProperty({
    description: 'Array of IDs to be used in bulk print',
    type: [Number],
    required: true,
  })
    ids: number[];
}
