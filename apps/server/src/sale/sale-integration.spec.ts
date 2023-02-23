import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SaleModule } from './sale.module';
import { SaleService } from './sale.service';
import { OrderDiscrimination } from '../order/types/order-discrimination.enum';

describe('Sale', () => {
  let app: INestApplication;
  const findSaleResponse =  {
    "count": 2,
    "data": [
      {
        "id": 50,
        "order_nr": "20700097",
        "order_date": "2020-04-07T00:00:00.000Z",
        "order_status": {
          "name": "Bestelling in behandeling"
        },
        "acompany_aorder_customer_idToacompany": {
          "name": "Stichting Leergeld Zuid-Holland Midden",
          "other_acompany": []
        }
      },
      {
        "id": 55,
        "order_nr": "2020000055",
        "order_date": "2020-04-08T00:00:00.000Z",
        "order_status": {
          "name": "Bestelling afgeleverd"
        },
        "acompany_aorder_customer_idToacompany": {
          "name": "Stichting Leergeld Soest/Baarn",
          "other_acompany": []
        }
      },
    ]
  }
  const sale = {
    "id": 1,
    "status_id": null,
    "customer_id": null,
    "supplier_id": null,
    "order_nr": "2020000056",
    "remarks": null,
    "order_date": Date(),
    "discount": null,
    "transport": null,
    "is_gift": null,
    "discr": OrderDiscrimination.SALE,
    "backingPurchaseOrder_id": null,
    "external_id": null,
    "delivery_type": null,
    "delivery_date": null,
    "delivery_instructions": null,
  };
  const saleService = { 
    findAll: () => findSaleResponse,
    create: () => sale 
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SaleModule],
    })
      .overrideProvider(SaleService)
      .useValue(saleService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET sales`, () => {
    return request(app.getHttpServer())
      .get('/sales')
      .expect(200)
      .expect(saleService.findAll());
  });

  it(`/POST sales`, () => {
    return request(app.getHttpServer())
      .post('/sales')
      .send({
        order_nr: sale.order_nr,
        order_date: sale.order_date,
      })
      .expect(201)
      .expect(saleService.create())
  });

  afterAll(async () => {
    await app.close();
  });
});
