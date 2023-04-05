import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { afile } from "@prisma/client";
import { IsString } from "class-validator";
import { FileDiscrimination } from "../types/file-discrimination.enum";

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
  @IsString()
  discr: FileDiscrimination;

  @ApiPropertyOptional()
  external_id: number | null;

  @ApiPropertyOptional()
  order_id: number | null;
}
