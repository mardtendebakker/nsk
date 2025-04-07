import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../../user/model/group.enum';
import { SecuritySystem } from '../security.system';

export class SignInResponseDto {
  @ApiProperty()
    username: string;

  @ApiProperty()
    email: string;

  @ApiProperty()
    accessToken: string;

  @ApiProperty()
    refreshToken: string;

  @ApiProperty()
    emailVerified: boolean;

  @ApiProperty()
    groups: Group[];

  @ApiProperty()
    securitySystem: SecuritySystem;
}
