import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class  IndexSearchDto {
  @ApiProperty()
  orderNumber: string;

  @ApiPropertyOptional()
  type?: string;
}