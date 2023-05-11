import { Prisma } from "@prisma/client";
import { OrderDiscrimination } from "./types/order-discrimination.enum";
import { ServiceStatus } from "../service/enum/service-status.enum";
export type OrderPayload = Prisma.aorderGetPayload<Record<'select', Prisma.aorderSelect>>;

export class OrderProcess {
  private totalPrice: number = null;

  constructor( private readonly order: OrderPayload ) {}

  public async run() {
    this.totalPrice = this.calculateTotalPrice();

    return {
      ...this.order,
      totalPrice: this.totalPrice,
    };
  }

  private calculateTotalPrice() {
    let price = 0;

    if (this.order.is_gift) {
      return price;
    }

    for (let i = 0; i < this.order?.product_order?.length; i++) {
      const pOrder = this.order?.product_order?.[i];
      price += pOrder.price * pOrder.quantity;

      for (let j = 0; j < pOrder?.['aservice']?.length; j++) {
        const service = pOrder?.['aservice']?.[j];

        if (this.order.discr === OrderDiscrimination.SALE && service.status !== ServiceStatus.STATUS_CANCEL) {
          price += service.price;
        }
      }
    }

    if (this.order.discount > 0) {
      price -= this.order.discount;
    }

    if (this.order.transport > 0) {
      price += this.order.transport;
    }

    return price;
  }
}
