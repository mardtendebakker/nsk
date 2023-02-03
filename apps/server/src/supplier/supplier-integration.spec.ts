import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SupplierModule } from './supplier.module';
import { SupplierService } from './supplier.service';

describe('Supplier', () => {
  let app: INestApplication;
  const findSupplierResponse =  [
    {
      "id": 39,
      "name": "Giga",
      "representative": "Berno / Xaomi",
      "email": "info@giga.nl",
      "partner_id": null
    },
    {
      "id": 41,
      "name": "Jorden.nl",
      "representative": null,
      "email": "info@jorden.nl",
      "partner_id": null
    },
  ];
  const supplier = {
    "id": 50,
    "partner_id": null,
    "name": "supplier_test",
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
    "discr": "s",
    "is_partner": null,
    "external_id": null
  };

  const supplierService = { 
    findAll: () => findSupplierResponse,
    create: () => supplier
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SupplierModule],
    })
      .overrideProvider(SupplierService)
      .useValue(supplierService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET suppliers`, () => {
    return request(app.getHttpServer())
      .get('/suppliers')
      .expect(200)
      .expect(supplierService.findAll());
  });

  it(`/POST supplier`, () => {
    return request(app.getHttpServer())
      .post('/suppliers')
      .send({name: supplier.name})
      .expect(201)
      .expect(supplierService.create())
  });

  afterAll(async () => {
    await app.close();
  });
});
