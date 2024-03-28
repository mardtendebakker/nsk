import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsString, ValidateIf } from 'class-validator';

export class PrismaTaskCreateInputDto implements Prisma.taskCreateInput {
  @ApiProperty()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
    name: string;

  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
    description?: string;

  @ApiPropertyOptional()
    aservice?: Prisma.aserviceCreateNestedManyWithoutTaskInput;

  @ApiPropertyOptional()
    product_type_task?: Prisma.product_type_taskCreateNestedManyWithoutTaskInput;
}
