import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetPickupDto {
  @ApiProperty()
  @IsString()
  recaptchaKey: string;

  @ApiProperty()
  @IsString()
  locationId: string;

  @ApiProperty()
  orderStatusName?: string;

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
