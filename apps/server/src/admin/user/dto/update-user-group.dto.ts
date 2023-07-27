import { ApiProperty } from "@nestjs/swagger";
import { CognitoGroups } from "../../../common/types/cognito-groups.enum";
import { IsBoolean, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export class UpdateUserGroupDto {
  @ApiProperty({
    enum: CognitoGroups,
    enumName: 'CognitoGroups'
  })
  @IsEnum(CognitoGroups)
  @Type(() => String)
  group: CognitoGroups;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  assign: boolean;
}
