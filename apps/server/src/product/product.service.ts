import { Inject, Injectable } from '@nestjs/common';
import { LocationService } from '../admin/location/location.service';
import { StockService } from '../stock/stock.service';
import { ProductRepository } from './product.repository';
import { FileService } from '../file/file.service';
import { PrintService } from '../print/print.service';
import { EntityStatus } from '../common/types/entity-status.enum';
import { LocationLabelService } from '../location-label/location-label.service';
import { BlanccoService } from '../blancco/blancco.service';

@Injectable()
export class ProductService extends StockService {
  constructor(
    protected readonly repository: ProductRepository, 
    protected readonly locationService: LocationService,
    protected readonly locationLabelService: LocationLabelService,
    protected readonly fileService: FileService,
    protected readonly printService: PrintService,
    protected readonly blanccoService: BlanccoService,
    @Inject('ENTITY_STATUS') protected readonly entityStatus: EntityStatus,
  ) {
    super(repository, locationService, locationLabelService, fileService, printService, blanccoService, entityStatus);
  }
}
