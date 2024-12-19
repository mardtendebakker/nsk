import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../model/gender.enum';
import { Group } from '../model/group.enum';

export class UserResponseDto {
  @ApiProperty()
    id: string | number;

  @ApiProperty()
    firstName?: string;

  @ApiProperty()
    lastName?: string;

  @ApiProperty()
    username: string;

  @ApiProperty()
    email: string;

  @ApiProperty()
    gender?: Gender;

  @ApiProperty()
    enabled: boolean;

  @ApiProperty()
    emailVerified: boolean;

  @ApiProperty()
    groups: Group[];

  @ApiProperty()
    createdAt: Date;

  @ApiProperty()
    updatedAt: Date;
}
