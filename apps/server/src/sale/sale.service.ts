import {
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { AOrderService } from '../aorder/aorder.service';
import { SaleRepository } from './sale.repository';
import { PrintService } from '../print/print.service';
import { FileService } from '../file/file.service';
import { AProductService } from '../aproduct/aproduct.service';
import { Prisma } from '@prisma/client';
import { CreateAServiceDto } from '../aservice/dto/create-aservice.dto';
import { AServiceDiscrimination } from '../aservice/enum/aservice-discrimination.enum';
import { AServiceStatus } from '../aservice/enum/aservice-status.enum';

@Injectable()
export class SaleService extends AOrderService {
  constructor(
    protected readonly repository: SaleRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
    protected readonly aProductService: AProductService,
  ) {
    super(repository, printService, fileService, AOrderDiscrimination.SALE);
  }

  async addProducts(id: number, productIds: number[]) {
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
      quantity: 1,
    }));

    const addProductsToOrderParams: Prisma.aorderUpdateArgs = {
      where: { id },
      data: {
        product_order: {
          createMany: {
            data: productOrderData,
          },
        },
      },
    };

    return this.repository.update(this.processSelectPart(addProductsToOrderParams));
  }

  async removeProducts(id: number, productIds: number[]) {
    const deleteProductsFromOrderParams: Prisma.aorderUpdateArgs = {
      where: { id },
      data: {
        product_order: {
          deleteMany: {
            product_id: {
              in: productIds,
            },
          },
        },
      },
    };

    return this.repository.update(this.processSelectPart(deleteProductsFromOrderParams));
  }

  protected getCreateSalesServiceInput(description: string): CreateAServiceDto {
    const toDoServie: CreateAServiceDto = {
      discr: AServiceDiscrimination.SalesService,
      status: AServiceStatus.STATUS_TODO,
      description: description,
    };

    return toDoServie;
  }

  private areProductIdsEqual(poductIds1: number[], poductIds2: number[]): boolean {
    if (poductIds1.length !== poductIds2.length) {
      return false;
    }
    return poductIds1.every(item => poductIds2.includes(item));
  }
}
