import { ApiProperty } from '@nestjs/swagger';
import { FindModuleResponseDto } from '../../module/dto/find-module-response.dto';
import { Group } from '../../user/model/group.enum';
import { SecuritySystem } from '../security.system';

export class UserInfoDto {
  @ApiProperty()
    id: number | string;

  @ApiProperty()
    username: string;

  @ApiProperty()
    email: string;

  @ApiProperty()
    securitySystem: SecuritySystem;

  @ApiProperty()
    groups: Group[];

  @ApiProperty()
    emailVerified: boolean;

  @ApiProperty()
    enabled: boolean;

  @ApiProperty()
    createdAt: Date;

  @ApiProperty()
    updatedAt: Date;

  @ApiProperty()
    modules: FindModuleResponseDto[];
}
