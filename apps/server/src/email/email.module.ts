import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailSES } from './email.ses';
import { EmailLogRepository } from '../log/email-log.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [EmailService, EmailSES, EmailLogRepository, PrismaService],
})
@Global()
export class EmailModule {}
