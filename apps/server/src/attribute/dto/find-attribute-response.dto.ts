import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IFindManyRespone } from "../../common/interface/find-many-respone";
import { AttributeEntity } from "../entities/attribute.entity";

class AttributeOption {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price?: number;
}

class productType {
  @ApiProperty()
  id: number;
};

export class FindAttributeResponseDto extends OmitType(AttributeEntity, ['external_id', 'has_quantity'] as const) {
  @ApiProperty()
  productTypes: productType[];

  @ApiProperty()
  options: AttributeOption[];
}

export class FindAttributesResponeDto implements IFindManyRespone<FindAttributeResponseDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindAttributeResponseDto[]
}
