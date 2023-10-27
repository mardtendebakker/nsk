import { Test, TestingModule } from '@nestjs/testing';
import { LocationTemplateService } from './location-template.service';

describe('LocationTemplateService', () => {
  let service: LocationTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationTemplateService],
    }).compile();

    service = module.get<LocationTemplateService>(LocationTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
