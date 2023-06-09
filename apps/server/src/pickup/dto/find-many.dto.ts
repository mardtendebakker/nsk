import { ApiPropertyOptional } from "@nestjs/swagger";
import { FindManyDto as BaseFindManyDto } from "../../common/dto/find-many.dto";
import { ValidateIf } from "class-validator";
import { Transform } from "class-transformer";

export class FindManyDto extends BaseFindManyDto {
  @ApiPropertyOptional()
  @Transform(({value}) => value ? new Date(value) : value)
  @ValidateIf((_, value) => value !== undefined)
  startsAt?: Date;

  @ApiPropertyOptional()
  @Transform(({value}) => value ? new Date(value) : value)
  @ValidateIf((_, value) => value !== undefined)
  endsAt?: Date;
}
