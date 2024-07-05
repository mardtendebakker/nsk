import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { WebshopProductRepository } from './webshopProduct.repository';
import { FileService } from '../../file/file.service';
import { PrintService } from '../../print/print.service';
import { EntityStatus } from '../../common/types/entity-status.enum';
import { AProductService } from '../aproduct.service';
import { LocationService } from '../../admin/location/location.service';
import { LocationLabelService } from '../../location-label/location-label.service';
import { BlanccoService } from '../../blancco/blancco.service';

@Injectable()
export class WebshopProductService extends AProductService {
  constructor(
    protected readonly repository: WebshopProductRepository,
    protected readonly locationService: LocationService,
    protected readonly locationLabelService: LocationLabelService,
    protected readonly fileService: FileService,
    protected readonly printService: PrintService,
    protected readonly blanccoService: BlanccoService,
    protected readonly configService: ConfigService,
    protected readonly httpService: HttpService,
    @Inject('ENTITY_STATUS') protected readonly entityStatus: EntityStatus,
  ) {
    super(repository, locationService, locationLabelService, fileService, printService, blanccoService, configService, httpService, entityStatus);
  }
}
