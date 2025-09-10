import { Injectable, Logger } from '@nestjs/common';
import {
  SendBulkTemplatedEmailCommandInput, SendEmailCommandInput, SendEmailCommandOutput, Template,
} from '@aws-sdk/client-ses';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailSES } from './email.ses';
import { EmailTemplateDto } from './dto/create-email-template.dto';
import { BulkEmailDto } from './dto/send-bulk-email.dto';
import { BulkTemplate } from './dto/types';
import { EmailLogRepository } from '../log/email-log.repository';

@Injectable()
export class EmailService {
  constructor(
    private emailSES: EmailSES,
    private emailRepository: EmailLogRepository,
  ) {}

  async send(sendEmailDto: SendEmailDto): Promise<SendEmailCommandOutput | null> {
    const params: SendEmailCommandInput = {
      Destination: {
        ToAddresses: sendEmailDto.to,
      },
      Source: sendEmailDto.from,
      Message: {
        Subject: {
          Data: sendEmailDto.subject,
        },
        Body: {
          ...(sendEmailDto.text && { Text: { Data: sendEmailDto.text } }),
          ...(sendEmailDto.html && { Html: { Data: sendEmailDto.html } }),
        },
      },
    };

    let result: SendEmailCommandOutput;
    let apiError: Error | null = null;

    try {
      result = await this.emailSES.send(params);
    } catch (e) {
      apiError = e;
      Logger.error(e);
    }

    if (sendEmailDto.log) {
      await this.emailRepository.create({
        data: {
          from: sendEmailDto.from,
          to: JSON.stringify(sendEmailDto.to),
          successful: !apiError,
          content: sendEmailDto.text || sendEmailDto.html,
          api_error: apiError?.message || null,
          subject: sendEmailDto.subject,
        },
      });
    }

    if (!apiError) {
      return null;
    }

    return result;
  }

  createTemplate(emailTemplateDto: EmailTemplateDto) {
    const params: Template = {
      TemplateName: emailTemplateDto.name,
      SubjectPart: emailTemplateDto.subject,
      ...(emailTemplateDto.text && { TextPart: emailTemplateDto.text }),
      ...(emailTemplateDto.html && { HtmlPart: emailTemplateDto.html }),
    };

    return this.emailSES.createTemplate(params);
  }

  deleteTemplate(bulkTemplate: BulkTemplate) {
    return this.emailSES.deleteTemplate(bulkTemplate.name);
  }

  bulk(bulkEmailDto: BulkEmailDto) {
    const params: SendBulkTemplatedEmailCommandInput = {
      Destinations: [{
        Destination: {
          ToAddresses: bulkEmailDto.to,
        },
      }],
      Source: bulkEmailDto.from,
      Template: bulkEmailDto.template,
      DefaultTemplateData: JSON.stringify(bulkEmailDto.data),
    };

    return this.emailSES.bulk(params);
  }
}
