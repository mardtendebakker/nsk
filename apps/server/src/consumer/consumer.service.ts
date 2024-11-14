import { Injectable, OnModuleInit } from '@nestjs/common';
import { SaleService } from '../sale/sale.service';
import { WebshopService } from '../webshop/webshop.service';
import { ProductService } from '../product/product.service';
import { EntityStatus } from '../common/types/entity-status.enum';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  constructor(
    private saleService: SaleService,
    private webshopService: WebshopService,
    private productService: ProductService,
    private rabbitMQService: RabbitMQService,
  ) {}

  async onModuleInit() {
    await this.rabbitMQService.consumeProductPublished(this.handleProductPublished.bind(this));
    await this.rabbitMQService.consumeWebshopOrderCreated(this.handleWebshopOrderCreated.bind(this));
  }

  private async handleProductPublished(msg: { productId: number }): Promise<void> {
    const foundProduct = await this.productService.findOneRelation(msg.productId);

    if (!foundProduct || ![EntityStatus.Active, EntityStatus.Webshop].includes(foundProduct.entity_status)) {
      return;
    }

    const availableQuantity = this.productService.processStock(foundProduct).sale;
    await this.webshopService.addProduct(foundProduct, availableQuantity);
    await this.productService.updateOne(msg.productId, { entity_status: EntityStatus.Webshop });
  }

  private async handleWebshopOrderCreated(msg: { orderId: string }): Promise<void> {
    const {
      createdAt, updatedAt, customer, transport, products,
    } = await this.webshopService.fetchOrderById(msg.orderId);
    if (createdAt === updatedAt) {
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
}
