import { CreateTemplateCommand, SESClient, SendBulkTemplatedEmailCommand, SendBulkTemplatedEmailCommandInput, SendEmailCommand, SendEmailCommandInput, Template } from "@aws-sdk/client-ses";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailSES {
  private readonly client: SESClient;
  constructor( private readonly configService: ConfigService ) {
    this.client = new SESClient({ region: this.configService.get('MAIN_REGION')});
  }

  send(sendEmailCommandInput: SendEmailCommandInput) {
    const command = new SendEmailCommand(sendEmailCommandInput);

    return this.client.send(command);
  }

  createTemplate(template: Template) {
    const command = new CreateTemplateCommand({
      Template: template
    });

    return this.client.send(command);
  }

  bulk(bulkInput: SendBulkTemplatedEmailCommandInput) {
    const command = new SendBulkTemplatedEmailCommand(bulkInput);

    return this.client.send(command);
  }
}
