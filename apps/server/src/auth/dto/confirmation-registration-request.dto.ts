import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { EmailOrUsernameDto } from "./email-or-username.dto";

export class ConfirmRegistrationRequestDto extends EmailOrUsernameDto {
  @ApiProperty()
  @IsString()
  code: string;
}
