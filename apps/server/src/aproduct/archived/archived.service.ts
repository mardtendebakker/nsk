import { Inject, Injectable } from '@nestjs/common';
import { ArchivedRepository } from './archived.repository';
import { FileService } from '../../file/file.service';
import { PrintService } from '../../print/print.service';
import { EntityStatus } from '../../common/types/entity-status.enum';
import { AProductService } from '../aproduct.service';
import { LocationService } from '../../location/location.service';

@Injectable()
export class ArchivedService extends AProductService {
  constructor(
    protected readonly repository: ArchivedRepository,
    protected readonly locationService: LocationService,
    protected readonly fileService: FileService,
    protected readonly printService: PrintService,
    @Inject('ENTITY_STATUS') protected readonly entityStatus: EntityStatus
  ) {
    super(repository, locationService, fileService, printService, entityStatus);
  }

  async archive(ids: number[]) {
    return this.updateMany(ids, { entity_status: EntityStatus.Archived });
  }

  async unarchive(ids: number[]) {
    return this.updateMany(ids, { entity_status: EntityStatus.Active });
  }
}
