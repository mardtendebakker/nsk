import { ApiProperty } from "@nestjs/swagger";

export class TotalCount {
  @ApiProperty()
  totalSuppliers: number;
  
  @ApiProperty()
  totalCustomers: number;
}
