import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class UpdateOneDto {
  @ApiProperty()
  @Transform(({value}) => JSON.parse(value))
  where: any;

  @ApiProperty()
  @Transform(({value}) => JSON.parse(value))
  data: any;
}
