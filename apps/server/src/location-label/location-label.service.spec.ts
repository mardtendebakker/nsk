import { Test, TestingModule } from '@nestjs/testing';
import { LocationLabelService } from './location-label.service';

describe('LocationLabelService', () => {
  let service: LocationLabelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationLabelService],
    }).compile();

    service = module.get<LocationLabelService>(LocationLabelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
