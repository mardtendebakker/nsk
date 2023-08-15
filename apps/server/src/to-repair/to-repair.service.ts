import { Injectable } from '@nestjs/common';
import { LocationService } from '../location/location.service';
import { StockService } from '../stock/stock.service';
import { ToRepairRepository } from './to-repair.repository';
import { FileService } from '../file/file.service';
import { Prisma, product } from '@prisma/client';
import { REPAIR_PRODUCT_LOCATION_ID, REPAIR_PRODUCT_NAME } from './enum/repair-product.const';

@Injectable()
export class ToRepairService extends StockService {
  constructor(
    protected readonly repository: ToRepairRepository, 
    protected readonly locationService: LocationService,
    protected readonly fileService: FileService,
  ) {
    super(repository, locationService, fileService);
  }

  getCreateInput(): Prisma.productUncheckedCreateInput {
    const productToRepair: Prisma.productUncheckedCreateInput = {
      name: REPAIR_PRODUCT_NAME,
      location_id: REPAIR_PRODUCT_LOCATION_ID,
      sku: String(Math.floor(Date.now() / 1000)),
    };

    return productToRepair;
  }

  create(): Promise<product> {
    return this.repository.create(this.getCreateInput());
  }
}
