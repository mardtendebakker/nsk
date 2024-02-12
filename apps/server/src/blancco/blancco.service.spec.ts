import { Test, TestingModule } from '@nestjs/testing';
import { BlanccoService } from './blancco.service';
import { PurchaseService } from '../purchase/purchase.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BlanccoRepository } from './blancco.repository';
import { readFileSync } from 'fs';

describe('BlanccoService', () => {
  let service: BlanccoService;
  const orderId = 8071;
  const order_nr = '2023008071';
  const zipReportMock = readFileSync(`apps/server/src/blancco/mock/${order_nr}.zip`);
  const jsonReportMock = JSON.parse(readFileSync(`apps/server/src/blancco/mock/${order_nr}.json`, 'utf-8'));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers:
      [
        BlanccoService,
        ConfigService,
        BlanccoRepository,
        {
          provide: PurchaseService,
          useValue: {
            findOne: jest.fn((orderId: number) => Promise.resolve({ order_nr }))
          }
        },
      ],
    }).compile();

    service = module.get<BlanccoService>(BlanccoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a json reports', () => {
    const downloadReportsMock = jest.spyOn(service as any, 'downloadReports');
    downloadReportsMock.mockResolvedValue(zipReportMock);

    expect(service.getReports(orderId)).resolves.toStrictEqual(jsonReportMock);
  });
});
