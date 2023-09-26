import { Inject, Injectable } from '@nestjs/common';
import { StockService } from '../stock/stock.service';
import { LocationService } from '../location/location.service';
import { FileService } from '../file/file.service';
import { AProductRepository } from './aproduct.repository';
import { PrintService } from '../print/print.service';
import { EntityStatus } from '../common/types/entity-status.enum';

@Injectable()
export class AProductService extends StockService {
  constructor(
    protected readonly repository: AProductRepository,
    protected readonly locationService: LocationService,
    protected readonly fileService: FileService,
    protected readonly printService: PrintService,
    @Inject('ENTITY_STATUS') protected readonly entityStatus: EntityStatus,
  ) {
    super(repository, locationService, fileService, printService, entityStatus);
  }
}
