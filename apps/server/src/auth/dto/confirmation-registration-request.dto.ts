import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserUsernameDto } from "./user-username.dto";

export class ConfirmationRegistrationRequestDto extends UserUsernameDto {
  @ApiProperty()
  @IsString()
  code: string;
}
