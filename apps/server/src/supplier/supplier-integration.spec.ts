import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SupplierModule } from './supplier.module';
import { SupplierService } from './supplier.service';
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('Supplier', () => {
  let app: INestApplication;
  let config: ConfigService;
  let token: string;

  const findSupplierResponse =  [
    {
      "id": 39,
      "name": "Giga",
      "representative": "Berno / Xaomi",
      "email": "info@giga.nl",
      "partner_id": null
    },
    {
      "id": 41,
      "name": "Jorden.nl",
      "representative": null,
      "email": "info@jorden.nl",
      "partner_id": null
    },
  ];
  const supplier = {
    "id": 50,
    "partner_id": null,
    "name": "supplier_test",
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
    "discr": "s",
    "is_partner": null,
    "external_id": null
  };

  const supplierService = { 
    findAll: () => findSupplierResponse,
    create: () => supplier
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
        SupplierModule,
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
      .overrideProvider(SupplierService)
      .useValue(supplierService)
      .compile();

    app = moduleRef.createNestApplication();
    config = moduleRef.get<ConfigService>(ConfigService);
    await app.init();

    const authenticationResult = await mockCognitoClient.initiateAuth();
    token = authenticationResult.body.IdToken;
  });

  it(`/GET suppliers`, () => {
    return request(app.getHttpServer())
      .get('/suppliers')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect(supplierService.findAll());
  });

  it(`/POST supplier`, () => {
    return request(app.getHttpServer())
      .post('/suppliers')
      .set({ Authorization: `Bearer ${token}` })
      .send({name: supplier.name})
      .expect(201)
      .expect(supplierService.create())
  });

  afterAll(async () => {
    await app.close();
  });
});
