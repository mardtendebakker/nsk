import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [OrderService],
    })
    .useMocker((token) => {
      const results = [
        {
          "id": 5,
          "order_nr": "3003582367251270",
          "order_date": "2020-03-28T00:00:00.000Z",
          "company_name": "Summer Market"
        },
        {
          "id": 38,
          "order_nr": "2020000038",
          "order_date": "2020-03-31T00:00:00.000Z",
          "company_name": "IT Gigant"
        }
      ];
      if (token === OrderService) {
        return { getOrders: jest.fn().mockResolvedValue(results) };
      }
      if (typeof token === 'function') {
        const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      }
    })
    .compile();
    
    service = moduleRef.get(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
