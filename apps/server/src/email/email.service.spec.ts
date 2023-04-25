import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { ConfigService } from '@nestjs/config';
import { EmailSES } from './email.ses';

describe('EmailService', () => {
  let service: EmailService;

  const sendEmailDto: SendEmailDto = {
    to: ["email02@domain.nl"],
    from: "email01@domain.nl",
    subject: "smaple subject 01",
    text: "this is from email ses"
  };

  const createTemplateDto = {
    name: "template02",
    subject: "smaple subject 02",
    text: "Dear {{name}},\r\nthis is from bulk email ses."
  };

  const bulkEmailDto = {
    to: ["email02@domain.nl"],
    from: "email01@domain.nl",
    template: "template02",
    data: JSON.stringify({
      name: "USER_NAME"
    })
  };

  const bulkTemplateDto = {
    name: "template01"
  };

  const emailSESSendResult = {
    "$metadata": {
      "httpStatusCode": 200,
      "requestId": "691576d0-27a7-421a-895a-edc676035d6c",
      "attempts": 1,
      "totalRetryDelay": 0
    },
    "MessageId": "01000187b93ed845-c1b44b20-b559-4808-b17b-f4ca300d0f79-000000"
  };

  const emailSESCreateTemplateResult = {
    "$metadata": {
      "httpStatusCode": 200,
      "requestId": "e8cf6abb-cae8-4093-9ee5-af18d436fb63",
      "attempts": 1,
      "totalRetryDelay": 0
    }
  };

  const emailSESDeleteTemplateResult = {
    "$metadata": {
      "httpStatusCode": 200,
      "requestId": "570231bc-9242-4220-93a3-df1b684ed2f6",
      "attempts": 1,
      "totalRetryDelay": 0
    }
  };

  const emailSESBulkResult = {
    "$metadata": {
      "httpStatusCode": 200,
      "requestId": "3397fc8a-53ed-4bce-9f4f-7a11c1fbdfeb",
      "attempts": 1,
      "totalRetryDelay": 0
    },
    "Status": [
      {
        "Status": "Success",
        "MessageId": "01000187b9ade1cb-3e4e53c5-a64b-49fd-8823-2e950ea24022-000000"
      }
    ]
  }

  const emailSES = {
    send: jest.fn(() => Promise.resolve(emailSESSendResult)),
    createTemplate: jest.fn(() => Promise.resolve(emailSESCreateTemplateResult)),
    deleteTemplate: jest.fn(() => Promise.resolve(emailSESDeleteTemplateResult)),
    bulk: jest.fn(() => Promise.resolve(emailSESBulkResult)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'MAIN_REGION') {
                return 'us-east-1';
              }
              return null;
            }),
          }
        },
        {
          provide: EmailSES,
          useValue: emailSES
        }
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email', async () => {
    expect(await service.send(sendEmailDto)).toBe(emailSESSendResult);
  });

  it('should create an template', async () => {
    expect(await service.createTemplate(createTemplateDto)).toBe(emailSESCreateTemplateResult);
  });

  it('should delete an template', async () => {
    expect(await service.deleteTemplate(bulkTemplateDto)).toBe(emailSESDeleteTemplateResult);
  });

  it('should send bulk email', async () => {
    expect(await service.bulk(bulkEmailDto)).toBe(emailSESBulkResult);
  });
});
