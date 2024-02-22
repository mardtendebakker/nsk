import { ApiPropertyOptional } from "@nestjs/swagger";
import { FindManyDto as BaseFindManyDto } from "../../common/dto/find-many.dto";
import { IsOptional, IsString } from "class-validator";

export class FindManyDto extends BaseFindManyDto{
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  moduleName?: string;
}
