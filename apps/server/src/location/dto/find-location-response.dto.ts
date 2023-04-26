import { ApiProperty, PickType } from "@nestjs/swagger";
import { IFindManyRespone } from "../../common/interface/find-many-respone";
import { LocationEntity } from "../entities/location.entity";

class FindLocationResponeDto extends PickType(LocationEntity, [
  "id",
  "name",
  "zipcodes"
] as const) {}

export class FindLocationsResponeDto implements IFindManyRespone<FindLocationResponeDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindLocationResponeDto[]
}
