import { OmitType } from "@nestjs/swagger";
import { PrismaCompanyCreateInputDto } from "./prisma-company-create-input.dto";

export class CreateCompanyDto extends OmitType(PrismaCompanyCreateInputDto, ['discr'] as const) {}
