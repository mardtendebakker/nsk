import { ListUsersCommandOutput, UserType } from "@aws-sdk/client-cognito-identity-provider";
import { ResponseMetadata } from "@aws-sdk/types";
import { ApiProperty } from "@nestjs/swagger";

export class ListUserResponseDto implements ListUsersCommandOutput {
  @ApiProperty()
  Users?: UserType[];

  @ApiProperty()
  PaginationToken?: string;

  @ApiProperty()
  $metadata: ResponseMetadata;
}
