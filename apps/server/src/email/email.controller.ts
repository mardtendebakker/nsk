import { Body, Controller, Delete, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailTemplateDto } from './dto/create-email-template.dto';
import { BulkEmailDto } from './dto/send-bulk-email.dto';
import { BulkTemplate } from './dto/types';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  send(@Body() sendEmailDto: SendEmailDto) {
    return this.emailService.send(sendEmailDto);
  }

  @Post('template')
  createTemplate(@Body() emailTemplateDto: EmailTemplateDto) {
    return this.emailService.createTemplate(emailTemplateDto);
  }

  @Delete('template')
  deleteTemplate(@Body() bulkTemplate: BulkTemplate) {
    return this.emailService.deleteTemplate(bulkTemplate);
  }

  @Post('bulk')
  bulk(@Body() bulkEmailDto: BulkEmailDto) {
    return this.emailService.bulk(bulkEmailDto);
  }
}
