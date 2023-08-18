import { Injectable } from '@nestjs/common';
import { StockService } from '../stock/stock.service';
import { LocationService } from '../location/location.service';
import { FileService } from '../file/file.service';
import { AProductRepository } from './aproduct.repository';

@Injectable()
export class AProductService extends StockService {
  constructor(
    protected readonly repository: AProductRepository,
    protected readonly locationService: LocationService,
    protected readonly fileService: FileService
  ) {
    super(repository, locationService, fileService);
  }
}
