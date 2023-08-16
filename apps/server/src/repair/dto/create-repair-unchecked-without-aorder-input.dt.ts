import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateRepairUncheckedWithoutAOrderInputDto
  implements Prisma.repairUncheckedCreateWithoutAorderInput
{
  @ApiPropertyOptional()
  description?: string | null;

  @ApiPropertyOptional()
  damage?: string | null;
}
