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
import { WebshopService } from '../../webshop/webshop.service';

@Injectable()
export class WebshopProductService extends AProductService {
  constructor(
    protected readonly repository: WebshopProductRepository,
    protected readonly locationService: LocationService,
    protected readonly locationLabelService: LocationLabelService,
    protected readonly fileService: FileService,
    protected readonly printService: PrintService,
    protected readonly configService: ConfigService,
    protected readonly httpService: HttpService,
    @Inject('ENTITY_STATUS') protected readonly entityStatus: EntityStatus,
    protected readonly webshopService: WebshopService,
  ) {
    super(repository, locationService, locationLabelService, fileService, printService, configService, httpService, entityStatus);
  }

  async publishToStore(ids: number[]): Promise<string> {
    let successCount = 0;

    for (const id of ids) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const foundProduct = await this.findOneRelation(id);

        if (!foundProduct || ![EntityStatus.Active, EntityStatus.Webshop].includes(foundProduct.entity_status)) {
          return `There was an error publishing Art.nr ${id}: product is either inactive or not eligible for the webshop.`;
        }

        const availableQuantity = this.processStock(foundProduct).sale;

        // eslint-disable-next-line no-await-in-loop
        await this.webshopService.addProduct(foundProduct, availableQuantity);

        // eslint-disable-next-line no-await-in-loop
        await this.updateOne(id, { entity_status: EntityStatus.Webshop });

        successCount += 1;
      } catch (error) {
        return `There was an error publishing Art.nr ${id}: ${error.message || 'Unknown error occurred.'}`;
      }
    }

    if (successCount === ids.length) {
      return 'All products were published successfully.';
    }

    return `Some products were not published successfully. Total published: ${successCount} out of ${ids.length}.`;
  }
}
