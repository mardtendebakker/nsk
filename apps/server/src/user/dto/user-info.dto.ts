import { ApiProperty } from "@nestjs/swagger";

export class UserInfoDto {
  constructor() {
    this.username = '';
    this.email = '';
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
  email_verified: boolean;

  @ApiProperty()
  auth_time: number;

  @ApiProperty()
  exp: number;

  @ApiProperty()
  iat: number;
}
