import { Injectable } from '@nestjs/common';
import { SESClient, SendBulkTemplatedEmailCommandInput, SendEmailCommandInput, Template } from "@aws-sdk/client-ses";
import { SendEmailDto } from './dto/send-email.dto';
import { EmailSES } from './email.ses';
import { EmailTemplateDto } from './dto/create-email-template.dto';
import { BulkEmailDto } from './dto/send-bulk-email.dto';

@Injectable()
export class EmailService {
  private client: SESClient;
  constructor(
    private readonly emailSES: EmailSES
  ) {}
  
  send(sendEmailDto: SendEmailDto) {
    const params: SendEmailCommandInput = {
      Destination: {
        ToAddresses: sendEmailDto.to,
      },
      Source: sendEmailDto.from,
      Message: {
        Subject: {
          Data: sendEmailDto.subject
        },
        Body: {
          ...(sendEmailDto.text && {Text: {Data: sendEmailDto.text}}),
          ...(sendEmailDto.html && {Html: {Data: sendEmailDto.html}}),
        }
      }
    };

    return this.emailSES.send(params);
  }

  createTemplate(emailTemplateDto: EmailTemplateDto) {
    const params: Template = {
      TemplateName: emailTemplateDto.name,
      SubjectPart: emailTemplateDto.subject,
      ...(emailTemplateDto.text && {TextPart: emailTemplateDto.text}),
      ...(emailTemplateDto.html && {HtmlPart: emailTemplateDto.html}),
    }
    
    return this.emailSES.createTemplate(params);
  }

  bulk(bulkEmailDto: BulkEmailDto) {
    const params: SendBulkTemplatedEmailCommandInput = {
      Destinations: [{
        Destination: {
          ToAddresses: bulkEmailDto.to,
        }
      }],
      Source: bulkEmailDto.from,
      Template: bulkEmailDto.template,
      DefaultTemplateData: JSON.stringify(bulkEmailDto.data),
    };

    return this.emailSES.bulk(params);
  }
}
