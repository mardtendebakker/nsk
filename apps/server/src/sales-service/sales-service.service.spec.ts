import { Test, TestingModule } from '@nestjs/testing';
import { SalesServiceService } from './sales-service.service';

describe('SalesServiceService', () => {
  let service: SalesServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesServiceService],
    }).compile();

    service = module.get<SalesServiceService>(SalesServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
