import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LocalLoginDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}
