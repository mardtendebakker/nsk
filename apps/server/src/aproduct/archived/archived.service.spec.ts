import { Test, TestingModule } from '@nestjs/testing';
import { ArchivedService } from './archived.service';

describe('ArchivedService', () => {
  let service: ArchivedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchivedService],
    }).compile();

    service = module.get<ArchivedService>(ArchivedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
