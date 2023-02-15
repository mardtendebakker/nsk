import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserUsernameDto } from "./user-username.dto";

export class ConfirmPasswordRequestDto extends UserUsernameDto {
  @ApiProperty()
  @IsString()
  verificationCode: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}
