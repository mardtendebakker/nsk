import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderModule } from './order.module'
import { GroupBy } from './types/group-by.enum';
import { OrderService } from './order.service';


describe('Order', () => {
  let app: INestApplication;
  let config: ConfigService;
  let token: string;

  const analyticsResponse = {
    "sale": [
      {
        "year": 2022,
        "month": 5,
        "count": 33
      },
      {
        "year": 2022,
        "month": 6,
        "count": 22
      },
      {
        "year": 2022,
        "month": 7,
        "count": 33
      },
      {
        "year": 2022,
        "month": 8,
        "count": 22
      },
      {
        "year": 2022,
        "month": 9,
        "count": 33
      },
      {
        "year": 2022,
        "month": 10,
        "count": 22
      }
    ],
    "purchase": [
      {
        "year": 2022,
        "month": 5,
        "count": 22
      },
      {
        "year": 2022,
        "month": 6,
        "count": 33
      },
      {
        "year": 2022,
        "month": 7,
        "count": 22
      },
      {
        "year": 2022,
        "month": 8,
        "count": 33
      },
      {
        "year": 2022,
        "month": 9,
        "count": 22
      },
      {
        "year": 2022,
        "month": 10,
        "count": 33
      },
      {
        "year": 2023,
        "month": 1,
        "count": 22
      },
      {
        "year": 2023,
        "month": 5,
        "count": 33
      }
    ],
    "repair": [
      {
        "year": 2022,
        "month": 6,
        "count": 22
      },
      {
        "year": 2022,
        "month": 8,
        "count": 33
      },
      {
        "year": 2022,
        "month": 9,
        "count": 22
      },
      {
        "year": 2022,
        "month": 10,
        "count": 33
      }
    ]
  };

  const orderService = {
    analytics: () => analyticsResponse,
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
        OrderModule,
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
      .overrideProvider(OrderService)
      .useValue(orderService)
      .compile();

    app = moduleRef.createNestApplication();
    config = moduleRef.get<ConfigService>(ConfigService);
    await app.init();

    const authenticationResult = await mockCognitoClient.initiateAuth();
    token = authenticationResult.body.IdToken;
  });

  it(`/GET analytics`, () => {
    return request(app.getHttpServer())
      .get(`/orders/analytics?groupby=${GroupBy.MONTHS}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect(orderService.analytics());
  });

  afterAll(async () => {
    await app.close();
  });
});
