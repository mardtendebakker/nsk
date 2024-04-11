import { OmitType } from '@nestjs/swagger';
import { PrismaLocationLabelCreateInputDto } from './prisma-location-label-create-input.dto';

export class CreateLocationLabelDto extends OmitType(PrismaLocationLabelCreateInputDto, [
  'id',
  'created_at',
  'updated_at',
  'product',
] as const) {}
