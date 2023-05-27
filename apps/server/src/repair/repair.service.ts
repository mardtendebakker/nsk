import { Injectable } from '@nestjs/common';
import { LocationService } from '../location/location.service';
import { StockService } from '../stock/stock.service';
import { RepairRepository } from './repair.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RepairService extends StockService {
  constructor(
    protected readonly repository: RepairRepository, 
    protected readonly locationService: LocationService,
    protected readonly eventEmitter: EventEmitter2
  ) {
    super(repository, locationService, eventEmitter);
  }
}
