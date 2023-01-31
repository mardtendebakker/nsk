import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CustomerModule } from './customer.module';
import { CustomerService } from './customer.service';

describe('Customer', () => {
  let app: INestApplication;
  const findCustomerResponse =  [
    {
      "id": 40,
      "name": "Dini Met",
      "representative": "Dini Met",
      "email": "info@dini.nl",
      "partner_id": 8
    },
    {
      "id": 44,
      "name": "Zuid Groningen",
      "representative": "Hans Neiman",
      "email": "info@doost.nl",
      "partner_id": null
    },
  ]
  const customerService = { getCompanies: () => findCustomerResponse };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CustomerModule],
    })
      .overrideProvider(CustomerService)
      .useValue(customerService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET customers`, () => {
    return request(app.getHttpServer())
      .get('/customers')
      .expect(200)
      .expect(customerService.getCompanies());
  });

  afterAll(async () => {
    await app.close();
  });
});
