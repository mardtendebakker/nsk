import { ApiProperty } from "@nestjs/swagger";
import { IFindManyRespone } from "../../../common/interface/find-many-respone";
import { FindCalendarResponeDto } from "../../dto/find-calendar-response.dto";

export class FindDeliveriesResponeDto implements IFindManyRespone<FindCalendarResponeDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindCalendarResponeDto[];
}
