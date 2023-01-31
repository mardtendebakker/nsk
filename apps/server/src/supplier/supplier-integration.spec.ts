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
  ]
  const supplierService = { getCompanies: () => findSupplierResponse };

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
      .expect(supplierService.getCompanies());
  });

  afterAll(async () => {
    await app.close();
  });
});
