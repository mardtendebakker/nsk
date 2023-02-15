import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserUsernameDto } from "./user-username.dto";

export class ConfirmRegistrationRequestDto extends UserUsernameDto {
  @ApiProperty()
  @IsString()
  code: string;
}