import { Injectable } from '@nestjs/common';
import { LocationService } from '../location/location.service';
import { StockService } from '../stock/stock.service';
import { RepairRepository } from './repair.repository';
import { FileService } from '../file/file.service';

@Injectable()
export class RepairService extends StockService {
  constructor(
    protected readonly repository: RepairRepository, 
    protected readonly locationService: LocationService,
    protected readonly fileService: FileService,
  ) {
    super(repository, locationService, fileService);
  }
}
