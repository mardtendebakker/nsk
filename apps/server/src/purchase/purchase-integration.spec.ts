import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PurchaseModule } from './purchase.module';
import { PurchaseService } from './purchase.service';
import { OrderDiscrimination } from '../order/types/order-discrimination.enum';

describe('Purchase', () => {
  let app: INestApplication;
  const findPurchaseResponse =  {
    "count": 2,
    "data": [
      {
        "id": 7,
        "order_nr": "3003601118171270",
        "order_date": "2020-03-28T00:00:00.000Z",
        "order_status": {
          "name": "Aankoop bezorgd"
        },
        "acompany_aorder_supplier_idToacompany": {
          "name": "SHENZHEN TP COMPANY",
          "other_acompany": []
        }
      },
      {
        "id": 38,
        "order_nr": "2020000038",
        "order_date": "2020-03-31T00:00:00.000Z",
        "order_status": {
          "name": "Aankoop bezorgd"
        },
        "acompany_aorder_supplier_idToacompany": {
          "name": "IT Gigant",
          "other_acompany": []
        }
      }
    ]
  };
  const purchase = {
    "id": 1,
    "status_id": null,
    "customer_id": null,
    "supplier_id": null,
    "order_nr": "2020000039",
    "remarks": null,
    "order_date": Date(),
    "discount": null,
    "transport": null,
    "is_gift": null,
    "discr": OrderDiscrimination.PURCHASE,
    "backingPurchaseOrder_id": null,
    "external_id": null,
    "delivery_type": null,
    "delivery_date": null,
    "delivery_instructions": null,
  };
  const purchaseService = { 
    findAll: () => findPurchaseResponse,
    create: () => purchase 
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PurchaseModule],
    })
      .overrideProvider(PurchaseService)
      .useValue(purchaseService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET purchases`, () => {
    return request(app.getHttpServer())
      .get('/purchases')
      .expect(200)
      .expect(purchaseService.findAll());
  });

  it(`/POST purchases`, () => {
    return request(app.getHttpServer())
      .post('/purchases')
      .send({
        order_nr: purchase.order_nr,
        order_date: purchase.order_date,
      })
      .expect(201)
      .expect(purchaseService.create())
  });

  afterAll(async () => {
    await app.close();
  });
});
