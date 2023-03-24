import { Injectable } from '@nestjs/common';
import { LocationService } from '../location/location.service';
import { StockService } from '../stock/stock.service';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService extends StockService {
  constructor(
    protected readonly repository: ProductRepository, 
    protected readonly locationService: LocationService
  ) {
    super(repository, locationService);
  }
}
