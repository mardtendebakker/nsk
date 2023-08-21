import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { CreateAServiceDto } from "./create-aservice.dto";
import { AServiceStatus } from "../enum/aservice-status.enum";
import { IsEnum, IsInt, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateServiceDto extends OmitType(CreateAServiceDto, ['discr', 'status', 'relation_id']) {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  product_order_id: number;

  @ApiPropertyOptional({
    enum: AServiceStatus,
    enumName: 'AServiceStatus',
  })
  @IsEnum(AServiceStatus)
  @IsOptional()
  @Type(() => Number)
  status?: AServiceStatus;
}
