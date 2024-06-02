import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ArchivedRepository } from './archived.repository';
import { FileService } from '../../file/file.service';
import { PrintService } from '../../print/print.service';
import { EntityStatus } from '../../common/types/entity-status.enum';
import { AProductService } from '../aproduct.service';
import { LocationService } from '../../admin/location/location.service';
import { LocationLabelService } from '../../location-label/location-label.service';
import { BlanccoService } from '../../blancco/blancco.service';

@Injectable()
export class ArchivedService extends AProductService {
  constructor(
    protected readonly repository: ArchivedRepository,
    protected readonly locationService: LocationService,
    protected readonly locationLabelService: LocationLabelService,
    protected readonly fileService: FileService,
    protected readonly printService: PrintService,
    protected readonly blanccoService: BlanccoService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
    @Inject('ENTITY_STATUS') protected readonly entityStatus: EntityStatus,
  ) {
    super(repository, locationService, locationLabelService, fileService, printService, blanccoService, configService, httpService, entityStatus);
  }

  async archive(ids: number[]) {
    return this.updateMany({ ids, product: { entityStatus: EntityStatus.Archived } });
  }

  async unarchive(ids: number[]) {
    return this.updateMany({ ids, product: { entityStatus: EntityStatus.Active } });
  }
}
