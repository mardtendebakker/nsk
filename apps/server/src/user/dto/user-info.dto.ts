import { ApiProperty } from "@nestjs/swagger";
import { FindModuleResponseDto } from "../../module/dto/find-module-response.dto";

export class UserInfoDto {
  constructor() {
    this.username = '';
    this.email = '';
    this.groups = [''];
    this.email_verified = false;
    this.auth_time = 0;
    this.exp = 0;
    this.iat = 0;
  }
  
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  groups: string[];

  @ApiProperty()
  email_verified: boolean;

  @ApiProperty()
  auth_time: number;

  @ApiProperty()
  exp: number;

  @ApiProperty()
  iat: number;

  @ApiProperty()
  modules: FindModuleResponseDto[];
}
