import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { formDataStringTransform } from '../../common/transforms/form-data.transform';

export class CreateRepairUncheckedWithoutAOrderInputDto
implements Prisma.repairUncheckedCreateWithoutAorderInput {
  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
    description?: string | null;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
    damage?: string | null;
}
