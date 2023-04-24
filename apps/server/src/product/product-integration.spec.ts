import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ProductModule } from './product.module';
import { ProductService } from './product.service';
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('Products', () => {
  let app: INestApplication;
  let config: ConfigService;
  let token: string;

  const findProductResponse =  {
    "count": 18721,
    "data": [
      {
        "id": 34771,
        "sku": "1673098629",
        "name": "HP ProDesk 600 G1 SFF",
        "price": "2.20",
        "created_at": "2023-01-07T14:37:08.000Z",
        "updated_at": "2023-01-07T14:37:08.000Z",
        "location": "Televisiestraat 2E",
        "purch": 1,
        "stock": 1,
        "hold": 0,
        "sale": 1,
        "sold": 0,
        "done": 0,
        "tasks": 15,
        "splittable": false
      },
      {
        "id": 34762,
        "sku": "19inch",
        "name": "19\"",
        "price": 0,
        "created_at": "2022-10-12T09:34:21.000Z",
        "updated_at": "2022-10-12T09:34:21.000Z",
        "location": "Televisiestraat 2E",
        "purch": 1,
        "stock": 1,
        "hold": 0,
        "sale": 1,
        "sold": 0,
        "done": 0,
        "tasks": 8,
        "splittable": false
      },
    ],
  };
  const product34762 = {
    "id": 34762,
    "sku": "19inch",
    "name": "19\"",
    "price": 0,
    "created_at": "2022-10-12T09:34:21.000Z",
    "updated_at": "2022-10-12T09:34:21.000Z",
    "product_order": [
      {
        "quantity": 1,
        "aorder": {
          "id": 5769,
          "order_nr": "2022005769",
          "order_date": "2022-09-26T00:00:00.000Z",
          "acompany_aorder_customer_idToacompany": null,
          "acompany_aorder_supplier_idToacompany": {
            "name": "TOP Week"
          },
          "order_status": {
            "name": "Pickup ingeboekt"
          }
        }
      }
    ],
    "afile": [],
    "attributes": [
      {
        "id": 15,
        "name": "Foto",
        "type": 2,
        "has_quantity": false,
        "attribute_option": []
      },
      {
        "id": 24,
        "name": "Schermdiagonaal",
        "type": 1,
        "has_quantity": false,
        "attribute_option": [
          {
            "id": 139,
            "name": "10.5",
            "price": 500
          },
          {
            "id": 140,
            "name": "11",
            "price": 500
          },
          {
            "id": 141,
            "name": "12.5",
            "price": 1000
          },
          {
            "id": 142,
            "name": "13,3",
            "price": 1000
          },
          {
            "id": 143,
            "name": "14",
            "price": 1500
          },
          {
            "id": 144,
            "name": "15",
            "price": null
          },
          {
            "id": 145,
            "name": "15.6",
            "price": 1500
          },
          {
            "id": 146,
            "name": "17",
            "price": 500
          },
          {
            "id": 147,
            "name": "19",
            "price": 500
          },
          {
            "id": 148,
            "name": "20",
            "price": 1000
          },
          {
            "id": 149,
            "name": "21",
            "price": 1000
          },
          {
            "id": 150,
            "name": "22",
            "price": 1000
          },
          {
            "id": 151,
            "name": "23",
            "price": 1500
          },
          {
            "id": 152,
            "name": "24",
            "price": 1500
          },
          {
            "id": 153,
            "name": "26",
            "price": 1500
          },
          {
            "id": 154,
            "name": "27",
            "price": 2000
          },
          {
            "id": 155,
            "name": "30",
            "price": 2000
          },
          {
            "id": 156,
            "name": "32",
            "price": 2000
          },
          {
            "id": 157,
            "name": "40",
            "price": 3000
          },
          {
            "id": 158,
            "name": "50",
            "price": 3000
          },
          {
            "id": 159,
            "name": "65",
            "price": 4000
          },
          {
            "id": 240,
            "name": "12.1",
            "price": 1000
          }
        ],
        "value": "141"
      },
      {
        "id": 34,
        "name": "Resolutie",
        "type": 1,
        "has_quantity": false,
        "attribute_option": [
          {
            "id": 167,
            "name": "1024 x 768 XGA",
            "price": 100
          },
          {
            "id": 168,
            "name": "1280 x 800 WXGA",
            "price": 300
          },
          {
            "id": 169,
            "name": "1280 x 1024 SXGA",
            "price": 500
          },
          {
            "id": 223,
            "name": "1366 × 768 WXGA HD",
            "price": 500
          },
          {
            "id": 224,
            "name": "1400 x 1050 SXGA+",
            "price": 500
          },
          {
            "id": 225,
            "name": "1440 x 900 WXGA+",
            "price": 500
          },
          {
            "id": 226,
            "name": "1600×900  WXGA++ HD+",
            "price": 500
          },
          {
            "id": 227,
            "name": "1680 x 1050 WSXGA+",
            "price": 500
          },
          {
            "id": 228,
            "name": "1600 x 1200 UXGA",
            "price": 500
          },
          {
            "id": 229,
            "name": "1920 x 1080 (Full HD)",
            "price": 500
          },
          {
            "id": 230,
            "name": "2048 x 1536 QXGA",
            "price": 500
          },
          {
            "id": 254,
            "name": "2560 x 1440",
            "price": 1000
          }
        ],
        "value": "169"
      },
      {
        "id": 46,
        "name": "Beeldverhouding",
        "type": 1,
        "has_quantity": false,
        "attribute_option": [
          {
            "id": 231,
            "name": "4:3",
            "price": 100
          },
          {
            "id": 232,
            "name": "16:9",
            "price": 200
          },
          {
            "id": 233,
            "name": "16:10",
            "price": 200
          }
        ]
      },
      {
        "id": 48,
        "name": "Overig",
        "type": 0,
        "has_quantity": false,
        "attribute_option": []
      }
    ],
    "listPrice": 15,
    "locations": {
      "0": {
        "id": 1,
        "name": "Televisiestraat 2E",
        "zipcodes": "2525"
      },
      "1": {
        "id": 2,
        "name": "Depot Uitdagingen",
        "zipcodes": null
      },
      "2": {
        "id": 3,
        "name": "Reigersdaal Heerhugowaard",
        "zipcodes": null
      },
      "3": {
        "id": 4,
        "name": "Vista College Geleen",
        "zipcodes": null
      },
      "value": 1
    },
    "product_statuses": {
      "0": {
        "id": 1,
        "name": "Ingeboekt"
      },
      "1": {
        "id": 2,
        "name": "Op voorraad gezet"
      },
      "2": {
        "id": 3,
        "name": "Inventaris - Eigen gebruik"
      },
      "3": {
        "id": 4,
        "name": "Afgekeurd"
      },
      "4": {
        "id": 5,
        "name": "no more Webshop"
      },
      "value": 1
    },
    "product_types": {
      "0": {
        "id": 3,
        "name": "Accu Laptop"
      },
      "1": {
        "id": 18,
        "name": "Camera"
      },
      "2": {
        "id": 1,
        "name": "Computer"
      },
      "3": {
        "id": 14,
        "name": "Geheugen"
      },
      "4": {
        "id": 25,
        "name": "Inpakmateriaal"
      },
      "5": {
        "id": 10,
        "name": "Kabels"
      },
      "6": {
        "id": 2,
        "name": "Laptop"
      },
      "7": {
        "id": 27,
        "name": "MainFrame"
      },
      "8": {
        "id": 7,
        "name": "Monitor 55-85 inch"
      },
      "9": {
        "id": 6,
        "name": "Monitor plat"
      },
      "10": {
        "id": 9,
        "name": "Muis"
      },
      "11": {
        "id": 4,
        "name": "Oplader"
      },
      "12": {
        "id": 15,
        "name": "Opslagmedium"
      },
      "13": {
        "id": 24,
        "name": "Overig"
      },
      "14": {
        "id": 19,
        "name": "Printer"
      },
      "15": {
        "id": 20,
        "name": "Printer groot formaat"
      },
      "16": {
        "id": 23,
        "name": "Rack/Rack Kits"
      },
      "17": {
        "id": 22,
        "name": "Router"
      },
      "18": {
        "id": 5,
        "name": "Server"
      },
      "19": {
        "id": 21,
        "name": "Switch"
      },
      "20": {
        "id": 28,
        "name": "Tablet"
      },
      "21": {
        "id": 17,
        "name": "Telefoon"
      },
      "22": {
        "id": 8,
        "name": "Toetsenbord"
      },
      "23": {
        "id": 26,
        "name": "TonerCartridges"
      },
      "24": {
        "id": 16,
        "name": "Voedingstype"
      },
      "value": 6
    }
  };

  const productService = { 
    findAll: () => findProductResponse,
    findOne: () => product34762
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
        ProductModule,
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
      .overrideProvider(ProductService)
      .useValue(productService)
      .compile();

    app = moduleRef.createNestApplication();
    config = moduleRef.get<ConfigService>(ConfigService);
    await app.init();

    const authenticationResult = await mockCognitoClient.initiateAuth();
    token = authenticationResult.body.IdToken;
  });

  it(`/GET products`, () => {
    return request(app.getHttpServer())
      .get(`/products`)
      .query({ skip: 0, limit: 2 })
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect(productService.findAll());
  });

  it(`/GET products/:id`, () => {
    return request(app.getHttpServer())
      .get(`/products/${product34762.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect(productService.findOne())
  });

  afterAll(async () => {
    await app.close();
  });
});
