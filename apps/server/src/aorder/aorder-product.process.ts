import { ProductOrderRelationProduct } from '../stock/types/product-order-relation-product';
import { ProductOrderDto } from './dto/find-aorder-response.dto';
import { AOrderProcessed } from './types/aorder-processed';
import { AOrderProductProcessed } from './types/aorder-product-processed';

export class AOrderProductProcess {
  private product_orders: ProductOrderDto[];

  constructor(private readonly aorder: AOrderProcessed) {}

  public run(): AOrderProductProcessed {
    const {
      product_order: productOrder,
      ...rest
    } = this.aorder;

    this.product_orders = productOrder.map(this.productOrderProcess);

    return {
      ...rest,
      product_orders: this.product_orders,
    };
  }

  private productOrderProcess(productOrder: ProductOrderRelationProduct): ProductOrderDto {
    const product = productOrder?.product;
    return {
      quantity: productOrder?.quantity ?? 1,
      product: product && {
        name: product.name,
      },
    };
  }
}
