import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PrismaAOrderCreateInputDto } from './prisma-aorder-create-input.dto';
import { CreateContactAOrderDto } from './create-contact-aorder.dto';

export class CreateAOrderDto extends OmitType(PrismaAOrderCreateInputDto, [
  'discr',
  'afile',
  'aorder',
  'other_aorder',
] as const) {
  @ApiPropertyOptional()
  @Type(() => CreateContactAOrderDto)
    customer?: CreateContactAOrderDto;

  @ApiPropertyOptional()
  @Type(() => CreateContactAOrderDto)
    supplier?: CreateContactAOrderDto;
}
