import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CognitoGroups } from '../../../common/types/cognito-groups.enum';

export class UpdateUserGroupDto {
  @ApiProperty({
    enum: CognitoGroups,
    enumName: 'CognitoGroups',
  })
  @IsEnum(CognitoGroups)
  @Type(() => String)
    group: CognitoGroups;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
    assign: boolean;
}
