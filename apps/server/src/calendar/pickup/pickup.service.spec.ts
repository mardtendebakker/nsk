import { Test } from '@nestjs/testing';

import { PickupService } from './pickup.service';
import { FindManyDto } from '../dto/find-many.dto';
import { PickupRepository } from './pickup.repository';

describe('PickupService', () => {
  let service: PickupService;

  const findAllRepo = {
    "count": 1,
    "data": [
      {
        "id": 3412,
        "data_destruction": 1,
        "origin": "Copiatek",
        "real_pickup_date": "2023-07-20T10:00:00.000Z",
        "aorder": {
          "id": 7802,
          "order_nr": "2023007802",
          "order_status": {
            "id": 2,
            "is_purchase": true,
            "is_sale": false,
            "is_repair": false,
            "pindex": 3,
            "name": "Pickup ingepland wijziging",
            "color": "#067cb7",
            "mailbody": null
          },
          "product_order": [
            {
              "id": 74481,
              "product": {
                "id": 52076,
                "name": "Cruquiusweg 10, 1019 AT Amsterdam"
              }
            },
            {
              "id": 74482,
              "product": {
                "id": 52077,
                "name": "Cruquiusweg 10, 1019 AT Amsterdam"
              }
            },
            {
              "id": 74483,
              "product": {
                "id": 52078,
                "name": "Cruquiusweg 10, 1019 AT Amsterdam"
              }
            },
            {
              "id": 74484,
              "product": {
                "id": 52079,
                "name": "Cruquiusweg 10, 1019 AT Amsterdam"
              }
            },
            {
              "id": 74485,
              "product": {
                "id": 52080,
                "name": "Cruquiusweg 10, 1019 AT Amsterdam"
              }
            },
            {
              "id": 74486,
              "product": {
                "id": 52081,
                "name": "Cruquiusweg 10, 1019 AT Amsterdam"
              }
            }
          ]
        },
        "fos_user": null
      }
    ]
  };
  const findAllResp = {
    "count": 1,
    "data": [
      {
        "id": 3412,
        "data_destruction": 1,
        "origin": "Copiatek",
        "real_pickup_date": "2023-07-20T10:00:00.000Z",
        "order": {
          "id": 7802,
          "order_nr": "2023007802",
          "order_status": {
            "id": 2,
            "is_purchase": true,
            "is_sale": false,
            "is_repair": false,
            "pindex": 3,
            "name": "Pickup ingepland wijziging",
            "color": "#067cb7",
            "mailbody": null
          },
          "products": [
            {
              "id": 52076,
              "name": "Cruquiusweg 10, 1019 AT Amsterdam"
            },
            {
              "id": 52077,
              "name": "Cruquiusweg 10, 1019 AT Amsterdam"
            },
            {
              "id": 52078,
              "name": "Cruquiusweg 10, 1019 AT Amsterdam"
            },
            {
              "id": 52079,
              "name": "Cruquiusweg 10, 1019 AT Amsterdam"
            },
            {
              "id": 52080,
              "name": "Cruquiusweg 10, 1019 AT Amsterdam"
            },
            {
              "id": 52081,
              "name": "Cruquiusweg 10, 1019 AT Amsterdam"
            }
          ]
        },
        "logistic": null
      }
    ]
  };
  const pickupRepository = {
    findAll: () => Promise.resolve(findAllRepo),
  };

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [PickupService, PickupRepository],
    })
      .overrideProvider(PickupRepository)
      .useValue(pickupRepository)
      .compile();

    service = app.get<PickupService>(PickupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getData', () => {
    it('should return findAllResp', async () => {
      const query: FindManyDto = {
        startsAt: new Date('2023-07-20'),
        endsAt: new Date('2023-07-26'),
        where: undefined,
      };

      const result = await service.findAll(query);

      expect(result).toEqual(findAllResp);
    });
  });
});
