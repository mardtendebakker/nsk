import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class CreateLogisticInputDto implements Prisma.fos_userCreateInput {
  @ApiProperty()
    username: string;

  @ApiProperty()
    username_canonical: string;

  @ApiProperty()
    email: string;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
    enabled: boolean;

  @ApiPropertyOptional()
    salt?: string;

  @ApiProperty()
    password: string;

  @ApiPropertyOptional()
    last_login?: string | Date;

  @ApiPropertyOptional()
    confirmation_token?: string;

  @ApiPropertyOptional()
    password_requested_at?: string | Date;

  @ApiProperty()
    roles: string;

  @ApiPropertyOptional()
    firstname?: string;

  @ApiPropertyOptional()
    lastname?: string;

  @ApiProperty()
    emailCanonical: string;

  @ApiPropertyOptional()
    pickup?: Prisma.pickupCreateNestedManyWithoutFos_userInput;

  @ApiPropertyOptional()
    user_location?: Prisma.user_locationCreateNestedManyWithoutFos_userInput;
}
