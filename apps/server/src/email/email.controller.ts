import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailTemplateDto } from './dto/create-email-template.dto';
import { BulkEmailDto } from './dto/send-bulk-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  send(@Body() sendEmailDto: SendEmailDto) {
    return this.emailService.send(sendEmailDto);
  }

  @Post('createtemplate')
  createTemplate(@Body() emailTemplateDto: EmailTemplateDto) {
    return this.emailService.createTemplate(emailTemplateDto);
  }

  @Post('bulk')
  bulk(@Body() bulkEmailDto: BulkEmailDto) {
    return this.emailService.bulk(bulkEmailDto);
  }
}
