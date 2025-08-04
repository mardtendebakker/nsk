import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { email_log } from '@prisma/client';

export class EmailLogEntity implements email_log {
  @ApiProperty()
    id: number;

  @ApiProperty()
    from: string;

  @ApiProperty()
    to: string;

  @ApiProperty()
    subject: string;

  @ApiProperty()
    successful: boolean;

  @ApiProperty()
    content: string;

  @ApiPropertyOptional()
    api_error: string | null;

  @ApiProperty()
    created_at: Date;

  @ApiProperty()
    updated_at: Date;
}
