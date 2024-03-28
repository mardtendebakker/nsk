import { ApiProperty } from '@nestjs/swagger';
import { aservice } from '@prisma/client';
import { AServiceDiscrimination } from '../enum/aservice-discrimination.enum';
import { AServiceStatus } from '../enum/aservice-status.enum';

export class AServiceEntity implements aservice {
  @ApiProperty()
    id: number;

  @ApiProperty()
    relation_id: number | null;

  @ApiProperty()
    task_id: number | null;

  @ApiProperty()
    status: AServiceStatus;

  @ApiProperty()
    description: string | null;

  @ApiProperty()
    discr: AServiceDiscrimination;

  @ApiProperty()
    price: number | null;
}
