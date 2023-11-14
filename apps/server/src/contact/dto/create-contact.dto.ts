import { OmitType } from '@nestjs/swagger';
import { PrismaContactCreateInputDto } from './prisma-contact-create-input.dto';

export class CreateContactDto extends OmitType(PrismaContactCreateInputDto, [
  'discr',
  'other_contact',
  'supplierOrders',
  'customerOrders',
  'fos_user',
  'product',
] as const) {}
