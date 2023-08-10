import { Test, TestingModule } from '@nestjs/testing';
import { SplitProductService } from './split-product.service';

describe('SplitProductService', () => {
  let service: SplitProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SplitProductService],
    }).compile();

    service = module.get<SplitProductService>(SplitProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
