import { Prisma } from "@prisma/client";
import { AOrderDiscrimination } from "./types/aorder-discrimination.enum";
import { AServiceStatus } from "../aservice/enum/aservice-status.enum";
export type AOrderPayload = Prisma.aorderGetPayload<Record<'select', Prisma.aorderSelect>>;
export type AOrderProcessed = AOrderPayload & {totalPrice: number, productIds: number[]};

export class AOrderProcess {
  private totalPrice: number;
  private productIds: number[];

  constructor( private readonly aorder: AOrderPayload ) {}

  public run() {
    const {product_order, ...restOrder} = this.aorder;
    this.totalPrice = this.calculateTotalPrice();
    this.productIds = this.ProductIdsMapper(product_order);

    return {
      ...restOrder,
      totalPrice: this.totalPrice,
      productIds: this.productIds,
    };
  }

  private ProductIdsMapper(product_order: typeof this.aorder.product_order): number[] {
    return product_order?.map(pOrder => pOrder.product_id) || [];
  }

  private calculateTotalPrice(): number {
    let price = 0;

    if (this.aorder.is_gift) {
      return price;
    }

    for (let i = 0; i < this.aorder?.product_order?.length; i++) {
      const pOrder = this.aorder?.product_order?.[i];
      price += (pOrder?.price ?? 0) * (pOrder?.quantity || 1);

      for (let j = 0; j < pOrder?.['aservice']?.length; j++) {
        const service = pOrder?.['aservice']?.[j];

        if (this.aorder.discr === AOrderDiscrimination.SALE && service.status !== AServiceStatus.STATUS_CANCEL) {
          price += service.price ?? 0;
        }
      }
    }

    if (this.aorder.discount > 0) {
      price -= this.aorder.discount;
    }

    if (this.aorder.transport > 0) {
      price += this.aorder.transport;
    }

    return price;
  }
}
