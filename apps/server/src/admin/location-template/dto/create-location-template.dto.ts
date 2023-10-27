import { OmitType } from "@nestjs/swagger";
import { PrismaLocationTemplateCreateInputDto } from "./prisma-location-template-create-input.dto";

export class CreateLocationTemplateDto extends OmitType(PrismaLocationTemplateCreateInputDto, [
  'id',
  'created_at',
  'updated_at',
] as const) {}
