import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SaleModule } from './sale.module';
import { SaleService } from './sale.service';
import { OrderDiscrimination } from '../order/types/order-discrimination.enum';
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';


describe('Sale', () => {
  let app: INestApplication;
  let config: ConfigService;
  let token: string;

  const findSaleResponse =  {
    "count": 2,
    "data": [
      {
        "id": 5919,
        "order_nr": "2022005919",
        "order_date": "2022-10-10T00:00:00.000Z",
        "remarks": null,
        "delivery_type": null,
        "delivery_date": null,
        "delivery_instructions": null,
        "order_status": {
          "id": 4,
          "name": "Bestelling afgeleverd",
          "color": "#c70a0a"
        },
        "product_order": [
          {
            "quantity": 1,
            "price": 10,
            "product": {
              "sku": "1657007075",
              "name": "Surface 32Gb",
              "product_type": {
                "name": "Tablet"
              }
            }
          },
        ],
        "acompany_aorder_customer_idToacompany": {
          "name": "Co Plus Enterprise LTD",
          "kvk_nr": 0,
          "representative": "Hasir Kamal",
          "email": "user@mail.nl",
          "phone": "+31611111111",
          "street": "Document is known",
          "street_extra": null,
          "city": "Accra",
          "zip": null,
          "state": null,
          "country": "US",
          "acompany": {
            "id": 2822,
            "name": "Co Plus Enterprise"
          }
        }
      },
      {
        "id": 5920,
        "order_nr": "2022005920",
        "order_date": "2022-10-10T00:00:00.000Z",
        "remarks": "Verzonden 11-10-2022",
        "delivery_type": null,
        "delivery_date": null,
        "delivery_instructions": null,
        "order_status": {
          "id": 4,
          "name": "Bestelling afgeleverd",
          "color": "#c70a0a"
        },
        "product_order": [
          {
            "quantity": 1,
            "price": 0,
            "product": {
              "sku": "1639731610",
              "name": "HP Chromebook 11 G5 EE (split 91)",
              "product_type": {
                "name": "Laptop"
              }
            }
          }
        ],
        "acompany_aorder_customer_idToacompany": {
          "name": "Salim\tKara",
          "kvk_nr": null,
          "representative": "Salim\tKara",
          "email": "Salimara@gmail.com",
          "phone": "0031 (6) 212 111 11",
          "street": "James Catsstraat\t100",
          "street_extra": null,
          "city": "Den Haag\tNL",
          "zip": "3514 GM",
          "state": null,
          "country": null,
          "acompany": {
            "id": 754,
            "name": "Seada"
          }
        }
      }
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
    const mockCognitoClient = {
      initiateAuth: async () => {
        return request(app.getHttpServer())
          .post("/cognito-testing-login")
          .send({
            username: config.get("COGNITO_USER_EMAIL"),
            password: config.get("COGNITO_USER_PASSWORD"),
            clientId: config.get("COGNITO_CLIENT_ID"),
          });
      },
    };
    const moduleRef = await Test.createTestingModule({
      imports: [
        SaleModule,
        ConfigModule.forRoot(),
        CognitoTestingModule.registerAsync({
          imports: [ConfigModule.forRoot()],
          useFactory: async (configService: ConfigService) => ({
            jwtVerifier: {
              userPoolId: configService.get<string>("COGNITO_USER_POOL_ID"),
              clientId: configService.get<string>("COGNITO_CLIENT_ID"),
              tokenUse: "id",
            },
            identityProvider: {
              region: configService.get<string>("MAIN_REGION"),
            },
          }),
          inject: [ConfigService],
        }),
      ],
    })
      .overrideProvider(SaleService)
      .useValue(saleService)
      .compile();

    app = moduleRef.createNestApplication();
    config = moduleRef.get<ConfigService>(ConfigService);
    await app.init();
    
    const authenticationResult = await mockCognitoClient.initiateAuth();
    token = authenticationResult.body.IdToken;
  });

  it(`/GET sales`, () => {
    return request(app.getHttpServer())
      .get('/sales')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect(saleService.findAll());
  });

  it(`/POST sales`, () => {
    return request(app.getHttpServer())
      .post('/sales')
      .set({ Authorization: `Bearer ${token}` })
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
