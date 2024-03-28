import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PrismaTaskCreateInputDto } from './prisma-task-create-input.dto';

export class CreateTaskDto extends OmitType(PrismaTaskCreateInputDto, [
  'aservice',
  'product_type_task',
] as const) {
  @ApiProperty()
  @Transform(({ value }) => (Array.isArray(value) ? value.map((id: string) => parseInt(id)) : parseInt(value)))
    productTypes: number[];
}
