import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderModule } from './order.module';

describe('Order', () => {
  let app: INestApplication;
  const findOrderResponse =  [
    {
      "id": 5,
      "order_nr": "3003582367251270",
      "order_date": "2020-03-28T00:00:00.000Z",
      "company_name": "Summer Market"
    },
    {
      "id": 38,
      "order_nr": "2020000038",
      "order_date": "2020-03-31T00:00:00.000Z",
      "company_name": "IT Gigant"
    }
  ]
  const orderService = { getOrders: () => [findOrderResponse[0]] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [OrderModule],
    })
      .overrideProvider(OrderService)
      .useValue(orderService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET orders`, () => {
    return request(app.getHttpServer())
      .get('/orders?order_nr=3003582367251270')
      .expect(200)
      .expect(orderService.getOrders());
  });

  afterAll(async () => {
    await app.close();
  });
});