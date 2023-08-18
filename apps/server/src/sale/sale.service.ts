import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { AOrderService } from '../aorder/aorder.service';
import { SaleRepository } from './sale.repository';
import { PrintService } from '../print/print.service';
import { FileService } from '../file/file.service';
import { AProductService } from '../aproduct/aproduct.service';

@Injectable()
export class SaleService extends AOrderService {
  constructor(
    protected readonly repository: SaleRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
    protected readonly aProductService: AProductService
  ) {
    super(repository, printService, fileService, AOrderDiscrimination.SALE);
  }

  async addProducts(id: number, productIds: number[]) {
    const order = await this.findOne(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const products = await this.aProductService.findAll({
      where: { id: { in: productIds } },
      excludeByOrderDiscr: this.type,
    });

    if (!this.areProductIdsEqual(productIds, products.data.map(p => p.id))) {
      throw new UnprocessableEntityException(
        'One or more product IDs already exist in one or more sales order'
      );
    }

    const productOrderData = products.data.map((product) => ({
      product_id: product.id,
      price: product.price,
      quantity: product.stock,
    }));

    return this.repository.update({
      where: { id },
      data: {
        product_order: {
          createMany: {
            data: productOrderData,
          },
        },
      },
    });
  }

  private areProductIdsEqual(poductIds1: number[], poductIds2: number[]): boolean {
    if (poductIds1.length !== poductIds2.length) {
      return false;
    }
    return poductIds1.every(item => poductIds2.includes(item));
  }
}
