import { Injectable, OnModuleInit } from '@nestjs/common';
import { SaleService } from '../sale/sale.service';
import { WebshopService } from '../webshop/webshop.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  constructor(
    private saleService: SaleService,
    private webshopService: WebshopService,
    private rabbitMQService: RabbitMQService,
  ) {}

  async onModuleInit() {
    await this.rabbitMQService.consumeWebshopOrderCreated(this.handleWebshopOrderCreated.bind(this));
  }

  private async handleWebshopOrderCreated(msg: { orderId: string }): Promise<void> {
    const {
      customer, transport, products,
    } = await this.webshopService.fetchOrderById(msg.orderId);
    const order = await this.saleService.create({
      customer: {
        email: customer.email,
        city: customer.city,
        country: customer.country,
        phone: customer.phone,
        name: customer.name,
        company_name: 'Magento',
        street: customer.street,
        zip: customer.zipcode,
      },
      status_id: 3,
      remarks: 'Order from Magento',
      transport,
    });

    await this.saleService.addProducts(order.id, products
      .filter(({ nexxus_id }) => !!nexxus_id)
      .map(({ nexxus_id, quantity }) => ({ productId: parseInt(nexxus_id, 10), quantity })));
  }
}
