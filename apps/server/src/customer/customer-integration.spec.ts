import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CustomerModule } from './customer.module';
import { CustomerService } from './customer.service';
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('Customer', () => {
  let app: INestApplication;
  let config: ConfigService;
  let token: string;

  const findCustomerResponse =  [
    {
      "id": 40,
      "name": "Dini Met",
      "representative": "Dini Met",
      "email": "info@dini.nl",
      "partner_id": 8
    },
    {
      "id": 44,
      "name": "Zuid Groningen",
      "representative": "Hans Neiman",
      "email": "info@doost.nl",
      "partner_id": null
    },
  ];
  
  const customer = {
    "id": 55,
    "partner_id": null,
    "name": "customer_test",
    "kvk_nr": null,
    "representative": null,
    "email": null,
    "phone": null,
    "phone2": null,
    "street": null,
    "street_extra": null,
    "city": null,
    "country": null,
    "state": null,
    "zip": null,
    "street2": null,
    "street_extra2": null,
    "city2": null,
    "country2": null,
    "state2": null,
    "zip2": null,
    "discr": "c",
    "is_partner": null,
    "external_id": null
  };

  const customerService = { 
    findAll: () => findCustomerResponse,
    create: () => customer 
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
        CustomerModule,
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
              region: configService.get<string>("COGNITO_REGION"),
            },
          }),
          inject: [ConfigService],
        }),
      ],
    })
      .overrideProvider(CustomerService)
      .useValue(customerService)
      .compile();

    app = moduleRef.createNestApplication();
    config = moduleRef.get<ConfigService>(ConfigService);
    await app.init();

    const authenticationResult = await mockCognitoClient.initiateAuth();
    token = authenticationResult.body.IdToken;
  });

  it(`/GET customers`, () => {
    return request(app.getHttpServer())
    .get('/customers')
    .set({ Authorization: `Bearer ${token}` })
    .expect(200)
    .expect(customerService.findAll());
  });

  it(`/POST customers`, () => {
    return request(app.getHttpServer())
      .post('/customers')
      .set({ Authorization: `Bearer ${token}` })
      .send({name: customer.name})
      .expect(201)
      .expect(customerService.create())
  });

  afterAll(async () => {
    await app.close();
  });
});
