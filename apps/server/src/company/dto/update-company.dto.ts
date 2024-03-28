import { OmitType } from '@nestjs/swagger';
import { PrismaCompanyUpdateInputDto } from './prisma-company-update-input.dto';

export class UpdateCompanyDto extends OmitType(PrismaCompanyUpdateInputDto, ['id', 'other_company', 'companyContacts'] as const) {}
