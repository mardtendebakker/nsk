import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserUsernameDto {
  @ApiProperty()
  @IsString()
  username: string;
}
