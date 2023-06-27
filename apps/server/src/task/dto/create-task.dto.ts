import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PrismaTaskCreateInputDto } from "./prisma-task-create-input.dto";
import { Transform } from "class-transformer";

export class CreateTaskDto extends OmitType(PrismaTaskCreateInputDto, [
  'aservice',
  'product_type_task',
] as const) {
  @ApiProperty()
  @Transform(({value}) => Array.isArray(value) ? value.map((id: string) => parseInt(id)) : parseInt(value))
  productTypes: number[];
}
