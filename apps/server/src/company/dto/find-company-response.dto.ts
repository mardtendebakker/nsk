import { ApiProperty, PickType } from "@nestjs/swagger";
import { IFindManyRespone } from "../../common/interface/find-many-respone";
import { CompanyEntity } from "../entities/company.entity";

class FindCompanyResponeDto extends PickType(CompanyEntity, [
  "id",
  "name",
  "representative",
  "email",
  "partner_id",
] as const) {}

export class FindCompaniesResponeDto implements IFindManyRespone<FindCompanyResponeDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindCompanyResponeDto[]
}
