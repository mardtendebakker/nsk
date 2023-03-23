import { Injectable } from '@nestjs/common';
import { LocationService } from '../location/location.service';
import { StockService } from '../stock/stock.service';
import { RepairRepository } from './repair.repository';

@Injectable()
export class RepairService extends StockService {
  constructor(
    protected readonly repository: RepairRepository, 
    protected readonly locationService: LocationService
  ) {
    super(repository, locationService);
  }
}
