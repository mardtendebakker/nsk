import { Injectable } from '@nestjs/common';
import { AServiceService } from '../aservice/aservice-service';
import { AServiceDiscrimination } from '../aservice/enum/aservice-discrimination.enum';
import { SalesServiceRepository } from './sales-service.repository';

@Injectable()
export class SalesServiceService extends AServiceService {
  constructor(protected readonly repository: SalesServiceRepository) {
    super(repository, AServiceDiscrimination.SalesService);
  }
}
