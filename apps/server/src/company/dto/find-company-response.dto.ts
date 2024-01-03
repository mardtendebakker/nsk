import { ApiProperty, PickType } from "@nestjs/swagger";
import { IFindManyRespone } from "../../common/interface/find-many-respone";
import { CompanyEntity } from "../entities/company.entity";

class FindCompanyResponseDto extends PickType(CompanyEntity, ['id'] as const) {
  @ApiProperty()
  contactsCount: string;
}

export class FindCompaniesResponseDto implements IFindManyRespone<FindCompanyResponseDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindCompanyResponseDto[]
}
