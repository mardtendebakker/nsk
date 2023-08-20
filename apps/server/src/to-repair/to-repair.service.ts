import { Injectable } from '@nestjs/common';
import { LocationService } from '../location/location.service';
import { StockService } from '../stock/stock.service';
import { ToRepairRepository } from './to-repair.repository';
import { FileService } from '../file/file.service';

@Injectable()
export class ToRepairService extends StockService {
  constructor(
    protected readonly repository: ToRepairRepository, 
    protected readonly locationService: LocationService,
    protected readonly fileService: FileService,
  ) {
    super(repository, locationService, fileService);
  }
}
