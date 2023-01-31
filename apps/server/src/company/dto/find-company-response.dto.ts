import { ApiProperty, PickType } from "@nestjs/swagger";
import { AcompanyEntity as CompanyEntity } from "../entities/company.entity";

class FindCompanyResponeDto extends PickType(CompanyEntity, [
  "id",
  "name",
  "representative",
  "email",
  "partner_id",
] as const) {}

export class FindCompaniesResponeDto {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindCompanyResponeDto[]
}
