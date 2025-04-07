import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderStatusModule } from '../order-status/order-status.module';
import { OrderStatusRepository } from './order-status.repository';
import { OrderStatuses } from './enums/order-statuses.enum';


describe('OrderStatus', () => {
  let app: INestApplication;
  let config: ConfigService;
  let token: string;

  const findAllRepo = {
    "count": 18,
    "data": [
      {
        "id": 1,
        "is_purchase": true,
        "is_sale": false,
        "is_repair": false,
        "pindex": 2,
        "name": "Pickup ingepland",
        "color": "#23b4c7",
        "mailbody": null
      },
      {
        "id": 2,
        "is_purchase": true,
        "is_sale": false,
        "is_repair": false,
        "pindex": 3,
        "name": "Pickup ingepland wijziging",
        "color": "#067cb7",
        "mailbody": null
      },
      {
        "id": 3,
        "is_purchase": false,
        "is_sale": true,
        "is_repair": false,
        "pindex": 8,
        "name": "Bestelling in behandeling",
        "color": "#c7ca02",
        "mailbody": null
      },
      {
        "id": 4,
        "is_purchase": false,
        "is_sale": true,
        "is_repair": false,
        "pindex": 10,
        "name": "Bestelling afgeleverd",
        "color": "#c70a0a",
        "mailbody": null
      },
      {
        "id": 5,
        "is_purchase": true,
        "is_sale": false,
        "is_repair": false,
        "pindex": 3,
        "name": "Pickup opgehaald",
        "color": "#00bf00",
        "mailbody": null
      },
      {
        "id": 6,
        "is_purchase": false,
        "is_sale": true,
        "is_repair": false,
        "pindex": 8,
        "name": "Bestelling geplaatst",
        "color": "#0080ff",
        "mailbody": null
      },
      {
        "id": 7,
        "is_purchase": false,
        "is_sale": true,
        "is_repair": false,
        "pindex": 9,
        "name": "Bestelling klaar voor levering",
        "color": "#e79404",
        "mailbody": null
      },
      {
        "id": 8,
        "is_purchase": false,
        "is_sale": true,
        "is_repair": false,
        "pindex": 7,
        "name": "Bestelling betaald",
        "color": "#03ba09",
        "mailbody": null
      },
      {
        "id": 9,
        "is_purchase": true,
        "is_sale": false,
        "is_repair": false,
        "pindex": 5,
        "name": "Pickup ingeboekt",
        "color": "#3e30a6",
        "mailbody": null
      },
      {
        "id": 10,
        "is_purchase": true,
        "is_sale": false,
        "is_repair": false,
        "pindex": 11,
        "name": "Aankoop geplaatst",
        "color": "#5b2054",
        "mailbody": null
      },
      {
        "id": 11,
        "is_purchase": true,
        "is_sale": false,
        "is_repair": false,
        "pindex": 12,
        "name": "Aankoop bezorgd",
        "color": "#7d00fa",
        "mailbody": null
      },
      {
        "id": 42,
        "is_purchase": false,
        "is_sale": true,
        "is_repair": false,
        "pindex": 7,
        "name": OrderStatuses.PRODUCTS_TO_ASSIGN,
        "color": "#000000",
        "mailbody": "Beste %supplier.name%,\r\n\r\nHartelijk dank voor uw bestelling. De opdracht is bij ons bekend onder SO %order.nr%.\r\nZodra de bestelstatus wordt veranderd, ontvangt u daar een email over.\r\n\r\nMet vriendelijke groet,\r\n%user.name% \r\n\r\nCopiatek\r\nTelevisiestraat 2-E, Unit 501\r\n2525 KD Den Haag\r\nTel 070 2136312"
      },
      {
        "id": 43,
        "is_purchase": true,
        "is_sale": false,
        "is_repair": false,
        "pindex": 1,
        "name": OrderStatuses.TO_PLAN_AND_PICKUP,
        "color": "#000000",
        "mailbody": null
      },
      {
        "id": 45,
        "is_purchase": false,
        "is_sale": true,
        "is_repair": false,
        "pindex": null,
        "name": OrderStatuses.TO_REPAIR,
        "color": null,
        "mailbody": null
      },
      {
        "id": 46,
        "is_purchase": true,
        "is_sale": false,
        "is_repair": false,
        "pindex": 6,
        "name": "Verklaring verstuurd",
        "color": "#bb7bc1",
        "mailbody": null
      },
      {
        "id": 47,
        "is_purchase": true,
        "is_sale": false,
        "is_repair": false,
        "pindex": 5,
        "name": "Pickup ingeboekt\t+ verklaring",
        "color": "#5e06b7",
        "mailbody": null
      },
      {
        "id": 48,
        "is_purchase": false,
        "is_sale": true,
        "is_repair": false,
        "pindex": null,
        "name": "Bestelling ingelezen uit webshop",
        "color": null,
        "mailbody": null
      },
      {
        "id": 49,
        "is_purchase": true,
        "is_sale": false,
        "is_repair": false,
        "pindex": null,
        "name": "Backorder",
        "color": null,
        "mailbody": null
      }
    ]
  };

  const orderStatusRepository = {
    findAll: () => findAllRepo,
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
        OrderStatusModule,
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
      .overrideProvider(OrderStatusRepository)
      .useValue(orderStatusRepository)
      .compile();

    app = moduleRef.createNestApplication();
    config = moduleRef.get<ConfigService>(ConfigService);
    await app.init();

    const authenticationResult = await mockCognitoClient.initiateAuth();
    token = authenticationResult.body.IdToken;
  });

  it(`/GET find all`, () => {
    return request(app.getHttpServer())
      .get('/admin/order-statuses')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect(orderStatusRepository.findAll());
  });

  afterAll(async () => {
    await app.close();
  });
});
