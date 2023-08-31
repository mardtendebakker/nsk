import { AOrderPayload } from "./types/aorder-payload";
import { ProductOrderRelation } from "../stock/types/product-order-relation";
import { ProductOrderDto } from "./dto/find-aorder-response.dto";
export type AOrderProductProcessed = AOrderPayload & {product_orders: ProductOrderDto[]};

export class AOrderProductProcess {
  private product_orders: ProductOrderDto[];

  constructor( private readonly aorder: AOrderPayload ) {}

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
      quantity: productOrder?.quantity,
      product: product && {
        name: product.name,
      },
    };
  }
}
