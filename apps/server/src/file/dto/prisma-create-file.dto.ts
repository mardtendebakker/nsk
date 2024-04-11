import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileDiscrimination } from '../types/file-discrimination.enum';

export class PrismaCreateFileDto {
  @ApiProperty()
    original_client_filename: string;

  @ApiProperty()
    unique_server_filename: string;

  @ApiProperty()
    discr: FileDiscrimination;

  @ApiPropertyOptional()
    external_id?: number;

  @ApiPropertyOptional()
    product_id?: number;

  @ApiPropertyOptional()
    order_id?: number;

  @ApiPropertyOptional()
    pickup_id?: number;
}
