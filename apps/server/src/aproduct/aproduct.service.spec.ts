import { Test, TestingModule } from '@nestjs/testing';
import { AProductService } from './aproduct.service';

describe('AProductService', () => {
  let service: AProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AProductService],
    }).compile();

    service = module.get<AProductService>(AProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
