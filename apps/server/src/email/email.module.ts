import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailSES } from './email.ses';

@Module({
  providers: [EmailService, EmailSES],
})
@Global()
export class EmailModule {}
