import { Injectable } from '@nestjs/common';
import { LocationService } from '../location/location.service';
import { StockService } from '../stock/stock.service';
import { ProductRepository } from './product.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductService extends StockService {
  constructor(
    protected readonly repository: ProductRepository, 
    protected readonly locationService: LocationService,
    protected readonly eventEmitter: EventEmitter2
  ) {
    super(repository, locationService, eventEmitter);
  }
}
