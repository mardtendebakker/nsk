import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskModule } from './task.module';
import { TaskRepository } from './task.repository';


describe('Task', () => {
  let app: INestApplication;
  let config: ConfigService;
  let token: string;

  const findAllRepo = {
    "count": 18,
    "data": [{
      "id": 1,
      "name": "Binnenkant schoonmaken",
      "description": "Met stofzuiger en compressor",
      "product_type_task": [{
        "product_type_id": 1
      }, {
        "product_type_id": 2
      }, {
        "product_type_id": 5
      }, {
        "product_type_id": 19
      }]
    }, {
      "id": 2,
      "name": "Buitenkant schoonmaken",
      "description": "Stickers verwijderen en alle verwijzingen naar de vorige eigenaar",
      "product_type_task": [{
        "product_type_id": 1
      }, {
        "product_type_id": 2
      }, {
        "product_type_id": 5
      }, {
        "product_type_id": 6
      }, {
        "product_type_id": 19
      }, {
        "product_type_id": 28
      }]
    }, {
      "id": 3,
      "name": "Inboeken en Barcode",
      "description": "Aanpassen van de PO, Invoeren specificaties zover mogelijk. Barcode printen en plakken",
      "product_type_task": [{
        "product_type_id": 1
      }, {
        "product_type_id": 2
      }, {
        "product_type_id": 5
      }, {
        "product_type_id": 6
      }, {
        "product_type_id": 19
      }, {
        "product_type_id": 28
      }]
    }, {
      "id": 4,
      "name": "BIOS PXE boot",
      "description": "Computers en laptops op pxe boot zetten. De pxe boot moet als eerst in de boot volgorde staan.",
      "product_type_task": [{
        "product_type_id": 1
      }, {
        "product_type_id": 5
      }]
    }, {
      "id": 5,
      "name": "Wipe & Inspoelen",
      "description": "Wipen in de stelling. Inspoelen met de juiste image",
      "product_type_task": [{
        "product_type_id": 1
      }, {
        "product_type_id": 2
      }, {
        "product_type_id": 5
      }, {
        "product_type_id": 28
      }]
    }]
  };

  const taskRepository = {
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
        TaskModule,
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
      .overrideProvider(TaskRepository)
      .useValue(taskRepository)
      .compile();

    app = moduleRef.createNestApplication();
    config = moduleRef.get<ConfigService>(ConfigService);
    await app.init();

    const authenticationResult = await mockCognitoClient.initiateAuth();
    token = authenticationResult.body.IdToken;
  });

  it(`/GET find all`, () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .query({ take: 5 })
      .query({ skip: 0 })
      .set({ Authorization: `Bearer ${token}` })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
