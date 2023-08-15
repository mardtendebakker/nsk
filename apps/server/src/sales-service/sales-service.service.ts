import { Injectable } from '@nestjs/common';
import { AServiceService } from '../aservice/aservice-service';
import { AServiceDiscrimination } from '../aservice/enum/aservice-discrimination.enum';

@Injectable()
export class SalesServiceService extends AServiceService {
  constructor() {
    super(AServiceDiscrimination.SalesService);
  }
}
