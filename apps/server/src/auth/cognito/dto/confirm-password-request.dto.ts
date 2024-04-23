import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { EmailOrUsernameDto } from "./email-or-username.dto";

export class ConfirmPasswordRequestDto extends EmailOrUsernameDto {
  @ApiProperty()
  @IsString()
  verificationCode: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}
