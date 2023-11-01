import { ApiProperty, PickType } from "@nestjs/swagger";
import { IFindManyRespone } from "../../../common/interface/find-many-respone";
import { LocationTemplateEntity } from "../entities/location-template.entity";

class FindLocationTemplateResponeDto extends PickType(LocationTemplateEntity, [
  "id",
  "location_id",
  "template",
  "created_at",
  "updated_at",
] as const) {}

export class FindLocationTemplatesResponeDto implements IFindManyRespone<FindLocationTemplateResponeDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindLocationTemplateResponeDto[]
}
