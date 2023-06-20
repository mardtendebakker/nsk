import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { fos_user } from "@prisma/client";

export class FosUserEntity implements fos_user {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  username: string;

  @ApiProperty()
  username_canonical: string;
  
  @ApiProperty()
  email: string;
  
  @ApiProperty()
  enabled: boolean;
  
  @ApiPropertyOptional()
  salt: string | null;
  
  @ApiProperty()
  password: string;
  
  @ApiPropertyOptional()
  last_login: Date | null;
  
  @ApiPropertyOptional()
  confirmation_token: string | null;
  
  @ApiPropertyOptional()
  password_requested_at: Date | null;
  
  @ApiProperty()
  roles: string;
  
  @ApiPropertyOptional()
  firstname: string | null;
  
  @ApiPropertyOptional()
  lastname: string | null;
  
  @ApiProperty()
  emailCanonical: string;

  @ApiPropertyOptional()
  partner_id: number | null;
}
