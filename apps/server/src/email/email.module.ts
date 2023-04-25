import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailSES } from './email.ses';

@Module({
  providers: [EmailService, EmailSES],
})
export class EmailModule {}
