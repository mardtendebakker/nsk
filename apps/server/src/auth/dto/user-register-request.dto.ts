import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserAuthenticationRequestDto } from "./user-authentication-request.dto";

export class UserRegisterRequestDto extends UserAuthenticationRequestDto {
  @ApiProperty()
  @IsString()
  email: string;
}
