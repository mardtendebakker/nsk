import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PurchaseModule } from './purchase.module';
import { PurchaseService } from './purchase.service';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('Purchase', () => {
  let app: INestApplication;
  let config: ConfigService;
  let token: string;

  const findPurchaseResponse =  {
    "count": 2,
    "data": [
      {
        "count": 2788,
        "data": [
          {
            "id": 62,
            "order_nr": "20211600",
            "order_date": "2020-04-09T00:00:00.000Z",
            "remarks": null,
            "delivery_type": null,
            "delivery_date": null,
            "delivery_instructions": null,
            "order_status": {
              "id": 11,
              "name": "Aankoop bezorgd",
              "color": "#7d00fa"
            },
            "product_order": [
              {
                "quantity": 1,
                "price": 199,
                "product": {
                  "sku": "1586422268",
                  "name": "HP 820",
                  "product_type": {
                    "name": "Laptop"
                  }
                }
              },
            ],
            "contact_aorder_supplier_idTocontact": {
              "name": "IT Plus",
              "kvk_nr": 76697460,
              "representative": "Makiato / Nasa",
              "email": "info@itplus.nl",
              "phone": "0111-111111",
              "street": "Hogeweg 8",
              "street_extra": null,
              "city": "Enschede",
              "zip": "7513 PG",
              "state": null,
              "country": "nl",
              "contact": null
            }
          },
          {
            "id": 63,
            "order_nr": "2020000063",
            "order_date": "2020-04-09T00:00:00.000Z",
            "remarks": null,
            "delivery_type": null,
            "delivery_date": null,
            "delivery_instructions": null,
            "order_status": {
              "id": 9,
              "name": "Pickup ingeboekt",
              "color": "#3e30a6"
            },
            "product_order": [
              {
                "quantity": 1,
                "price": 0,
                "product": {
                  "sku": "1586424005",
                  "name": "Dell Optiplex 790 - i3-2120",
                  "product_type": {
                    "name": "Computer"
                  }
                }
              },
            ],
            "contact_aorder_supplier_idTocontact": {
              "name": "Rain BV",
              "kvk_nr": null,
              "representative": "Rain Kamran",
              "email": "user@rain.nl",
              "phone": "0611111111",
              "street": "Laarastraat 12",
              "street_extra": null,
              "city": "Rijswijk",
              "zip": "6050JR",
              "state": null,
              "country": null,
              "contact": null
            }
          }
        ]
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
    "discr": AOrderDiscrimination.PURCHASE,
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
        PurchaseModule,
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
      .overrideProvider(PurchaseService)
      .useValue(purchaseService)
      .compile();

    app = moduleRef.createNestApplication();
    config = moduleRef.get<ConfigService>(ConfigService);
    await app.init();
    
    const authenticationResult = await mockCognitoClient.initiateAuth();
    token = authenticationResult.body.IdToken;
  });

  it(`/GET purchases`, () => {
    return request(app.getHttpServer())
      .get('/purchases')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect(purchaseService.findAll());
  });

  it(`/POST purchases`, () => {
    return request(app.getHttpServer())
      .post('/purchases')
      .set({ Authorization: `Bearer ${token}` })
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
