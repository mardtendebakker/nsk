import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserUsernameDto } from "./user-username.dto";

export class RefreshSesionRequestDto extends UserUsernameDto {
  @ApiProperty()
  @IsString()
  token: string;
}
