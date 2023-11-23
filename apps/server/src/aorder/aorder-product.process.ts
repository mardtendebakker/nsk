import { ProductOrderRelation } from "../stock/types/product-order-relation";
import { ProductOrderDto } from "./dto/find-aorder-response.dto";
import { AOrderProcessed } from "./aorder.process";
export type AOrderProductProcessed = Omit<
 AOrderProcessed,
  'product_order'
> & {product_orders: ProductOrderDto[]};

export class AOrderProductProcess {
  private product_orders: ProductOrderDto[];

  constructor( private readonly aorder: AOrderProcessed ) {}

  public run(): AOrderProductProcessed {
    const {
      product_order,
      ...rest
    } = this.aorder;

    this.product_orders = product_order.map(this.productOrderProcess);

    return {
      ...rest,
      product_orders: this.product_orders,
    };
  }

  private productOrderProcess(productOrder: ProductOrderRelation): ProductOrderDto {
    const product = productOrder?.product;
    return {
      quantity: productOrder?.quantity ?? 1,
      product: product && {
        name: product.name,
      },
    };
  }
}
