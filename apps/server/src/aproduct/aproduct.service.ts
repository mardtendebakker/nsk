import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { StockService } from '../stock/stock.service';
import { LocationService } from '../admin/location/location.service';
import { FileService } from '../file/file.service';
import { AProductRepository } from './aproduct.repository';
import { PrintService } from '../print/print.service';
import { EntityStatus } from '../common/types/entity-status.enum';
import { LocationLabelService } from '../location-label/location-label.service';

@Injectable()
export class AProductService extends StockService {
  constructor(
    protected readonly repository: AProductRepository,
    protected readonly locationService: LocationService,
    protected readonly locationLabelService: LocationLabelService,
    protected readonly fileService: FileService,
    protected readonly printService: PrintService,
    protected readonly configService: ConfigService,
    protected readonly httpService: HttpService,
    @Inject('ENTITY_STATUS') protected readonly entityStatus: EntityStatus,
  ) {
    super(
      repository,
      locationService,
      locationLabelService,
      fileService,
      printService,
      configService,
      httpService,
      entityStatus,
    );
  }
}
