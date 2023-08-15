import { OmitType } from "@nestjs/swagger";
import { PrismaAOrderCreateInputDto } from "./prisma-aorder-create-input.dto";

export class CreateAOrderDto extends OmitType(PrismaAOrderCreateInputDto, [
  'discr',
  'afile',
  'aorder',
  'other_aorder',
] as const) {}
