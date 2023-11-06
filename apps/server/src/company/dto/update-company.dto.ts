import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateCompanyDto } from "./create-company.dto";

export class UpdateCompanyDto extends PartialType(OmitType(CreateCompanyDto, ['id'])) {}
