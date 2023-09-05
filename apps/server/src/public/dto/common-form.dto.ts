import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { formDataStringTransform } from "../../common/transforms/form-date.transform";
import { Transform, Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class CommonFormDto {
  @ApiProperty()
  @Transform(formDataStringTransform)
  @IsString()
  @Type(() => String)
  orderStatusName: string;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
  confirmPage?: string;
}
