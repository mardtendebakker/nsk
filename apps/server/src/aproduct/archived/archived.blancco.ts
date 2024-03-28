import { Injectable } from '@nestjs/common';
import { BlanccoService } from '../../blancco/blancco.service';
import { AProductBlancco } from '../aproduct.blancco';
import { ArchivedRepository } from './archived.repository';
import { ArchivedService } from './archived.service';

@Injectable()
export class ArchivedBlancco extends AProductBlancco {
  constructor(
    protected readonly repository: ArchivedRepository,
    protected readonly archivedService: ArchivedService,
    protected readonly blanccoService: BlanccoService,
  ) {
    super(repository, archivedService, blanccoService);
  }
}
