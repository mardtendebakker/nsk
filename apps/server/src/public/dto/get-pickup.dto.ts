import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { GetCommonDto } from './get-common.dto';

export class GetPickupDto extends GetCommonDto {
  @ApiProperty()
  @IsString()
    locationId: string;

  @ApiProperty()
  @IsString()
    maxAddresses: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
    origin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
    confirmPage?: string;
}
