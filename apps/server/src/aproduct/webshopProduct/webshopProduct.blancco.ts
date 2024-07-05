import { Injectable } from '@nestjs/common';
import { BlanccoService } from '../../blancco/blancco.service';
import { AProductBlancco } from '../aproduct.blancco';
import { WebshopProductRepository } from './webshopProduct.repository';
import { WebshopProductService } from './webshopProduct.service';

@Injectable()
export class WebshopProductBlancco extends AProductBlancco {
  constructor(
    protected readonly repository: WebshopProductRepository,
    protected readonly webshopService: WebshopProductService,
    protected readonly blanccoService: BlanccoService,
  ) {
    super(repository, webshopService, blanccoService);
  }
}
