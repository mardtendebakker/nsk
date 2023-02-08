import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserUsernameDto } from "./user-username.dto";

export class UserAuthenticationRequestDto extends UserUsernameDto{
  @ApiProperty()
  @IsString()
  password: string;
}
