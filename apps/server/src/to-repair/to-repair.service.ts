import { Injectable } from '@nestjs/common';
import { LocationService } from '../location/location.service';
import { StockService } from '../stock/stock.service';
import { ToRepairRepository } from './to-repair.repository';
import { FileService } from '../file/file.service';
import { PrintService } from '../print/print.service';

@Injectable()
export class ToRepairService extends StockService {
  constructor(
    protected readonly repository: ToRepairRepository, 
    protected readonly locationService: LocationService,
    protected readonly fileService: FileService,
    protected readonly printService: PrintService,
  ) {
    super(repository, locationService, fileService, printService);
  }
}
