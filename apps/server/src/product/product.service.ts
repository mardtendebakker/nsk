import { Inject, Injectable } from '@nestjs/common';
import { LocationService } from '../location/location.service';
import { StockService } from '../stock/stock.service';
import { ProductRepository } from './product.repository';
import { FileService } from '../file/file.service';
import { PrintService } from '../print/print.service';
import { EntityStatus } from '../common/types/entity-status.enum';

@Injectable()
export class ProductService extends StockService {
  constructor(
    protected readonly repository: ProductRepository, 
    protected readonly locationService: LocationService,
    protected readonly fileService: FileService,
    protected readonly printService: PrintService,
    @Inject('ENTITY_STATUS') protected readonly entityStatus: EntityStatus,
  ) {
    super(repository, locationService, fileService, printService, entityStatus);
  }
}
