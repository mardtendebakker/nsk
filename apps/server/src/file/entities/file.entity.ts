import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { afile } from "@prisma/client";

export class FileEntity implements afile {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  product_id: number | null;

  @ApiPropertyOptional()
  pickup_id: number | null;

  @ApiProperty()
  original_client_filename: string;
  
  @ApiProperty()
  unique_server_filename: string;
  
  @ApiProperty()
  discr: string;

  @ApiPropertyOptional()
  external_id: number | null;

  @ApiPropertyOptional()
  order_id: number | null;
}
