import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AttributeModule } from './attribute.module';
import { AttributeRepository } from './attribute.repository';


describe('Attribute', () => {
  let app: INestApplication;
  let config: ConfigService;
  let token: string;

  const findAllRepo = {
    "count": 40,
    "data": [
      {
        "id": 1,
        "product_type_filter_id": null,
        "attr_code": "PC_model",
        "name": "PC Model",
        "price": 0,
        "type": 1,
        "has_quantity": false,
        "external_id": 1,
        "is_public": true
      },
      {
        "id": 2,
        "product_type_filter_id": null,
        "attr_code": "lap_model",
        "name": "Laptop Model",
        "price": 0,
        "type": 1,
        "has_quantity": false,
        "external_id": 2,
        "is_public": true
      },
      {
        "id": 3,
        "product_type_filter_id": null,
        "attr_code": "PC_brand",
        "name": "PC Merk",
        "price": 0,
        "type": 1,
        "has_quantity": false,
        "external_id": 3,
        "is_public": true
      },
      {
        "id": 4,
        "product_type_filter_id": null,
        "attr_code": "srvr_model",
        "name": "Server Model",
        "price": 0,
        "type": 1,
        "has_quantity": false,
        "external_id": 4,
        "is_public": true
      },
      {
        "id": 5,
        "product_type_filter_id": null,
        "attr_code": "proc",
        "name": "Processor model",
        "price": 0,
        "type": 0,
        "has_quantity": false,
        "external_id": 5,
        "is_public": true
      }
    ]
  };

  const attributeRepository = {
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
        AttributeModule,
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
      .overrideProvider(AttributeRepository)
      .useValue(attributeRepository)
      .compile();

    app = moduleRef.createNestApplication();
    config = moduleRef.get<ConfigService>(ConfigService);
    await app.init();

    const authenticationResult = await mockCognitoClient.initiateAuth();
    token = authenticationResult.body.IdToken;
  });

  it(`/GET find all`, () => {
    return request(app.getHttpServer())
      .get('/attributes')
      .query({ skip: 0 })
      .query({ take: 5 })
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect(attributeRepository.findAll());
  });

  afterAll(async () => {
    await app.close();
  });
});
