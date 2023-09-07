import { OmitType } from '@nestjs/swagger';
import { PrismaCompanyCreateInputDto } from './prisma-company-create-input.dto';

export class CreateCompanyDto extends OmitType(PrismaCompanyCreateInputDto, [
  'discr',
  'other_acompany',
  'supplierOrders',
  'customerOrders',
  'fos_user',
  'product',
] as const) {}
