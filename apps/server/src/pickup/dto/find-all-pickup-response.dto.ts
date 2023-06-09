import { ApiProperty , ApiPropertyOptional} from "@nestjs/swagger";
import { IFindManyRespone } from "../../common/interface/find-many-respone";
import { PickupEntity } from "../entities/pickup.entity";
import { order_status } from "@prisma/client";

class FindAllPickupResponeDto extends PickupEntity {
  @ApiProperty()
  id: number;
  
  @ApiPropertyOptional()
  pickup_date: Date | null;
  
  @ApiPropertyOptional()
  real_pickup_date: Date | null;
  
  @ApiPropertyOptional()
  origin: string | null;
  
  @ApiPropertyOptional()
  data_destruction: number | null;
  
  @ApiPropertyOptional()
  description: string | null;

  @ApiPropertyOptional()
  order:  {id: number, order_nr: string, order_status: order_status} | null;
  
  @ApiPropertyOptional()
  logistic: {id: number, username: string} | null;
}

export class FindPickupsResponeDto implements IFindManyRespone<FindAllPickupResponeDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindAllPickupResponeDto[]
}
