import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductStatusModule } from './product-status.module';
import { ProductStatusRepository } from './product-status.repository';


describe('ProductStatus', () => {
  let app: INestApplication;
  let config: ConfigService;
  let token: string;

  const findAllRepo = {
    "count": 5,
    "data": [
      {
        "id": 1,
        "is_stock": null,
        "is_saleable": null,
        "pindex": 1,
        "name": "Ingeboekt",
        "color": null
      },
      {
        "id": 2,
        "is_stock": null,
        "is_saleable": null,
        "pindex": 2,
        "name": "Op voorraad gezet",
        "color": null
      },
      {
        "id": 3,
        "is_stock": false,
        "is_saleable": false,
        "pindex": 4,
        "name": "Inventaris - Eigen gebruik",
        "color": null
      },
      {
        "id": 4,
        "is_stock": false,
        "is_saleable": false,
        "pindex": 5,
        "name": "Afgekeurd",
        "color": null
      },
      {
        "id": 5,
        "is_stock": false,
        "is_saleable": false,
        "pindex": 3,
        "name": "no more Webshop",
        "color": null
      }
    ]
  };

  const productStatusRepository = {
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
        ProductStatusModule,
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
      .overrideProvider(ProductStatusRepository)
      .useValue(productStatusRepository)
      .compile();

    app = moduleRef.createNestApplication();
    config = moduleRef.get<ConfigService>(ConfigService);
    await app.init();

    const authenticationResult = await mockCognitoClient.initiateAuth();
    token = authenticationResult.body.IdToken;
  });

  it(`/GET find all`, () => {
    return request(app.getHttpServer())
      .get('/product-statuses')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect(productStatusRepository.findAll());
  });

  afterAll(async () => {
    await app.close();
  });
});
