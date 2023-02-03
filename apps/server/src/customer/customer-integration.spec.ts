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
  const customer = {
    "id": 55,
    "partner_id": null,
    "name": "customer_test",
    "kvk_nr": null,
    "representative": null,
    "email": null,
    "phone": null,
    "phone2": null,
    "street": null,
    "street_extra": null,
    "city": null,
    "country": null,
    "state": null,
    "zip": null,
    "street2": null,
    "street_extra2": null,
    "city2": null,
    "country2": null,
    "state2": null,
    "zip2": null,
    "discr": "c",
    "is_partner": null,
    "external_id": null
  };
  const customerService = { 
    findAll: () => findCustomerResponse,
    create: () => customer 
  };

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
      .expect(customerService.findAll());
  });

  it(`/POST customers`, () => {
    return request(app.getHttpServer())
      .post('/customers')
      .send({name: customer.name})
      .expect(201)
      .expect(customerService.create())
  });

  afterAll(async () => {
    await app.close();
  });
});
