import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { format } from 'date-fns';
import { MessageProperties } from 'amqplib';
import { SaleService } from '../sale/sale.service';
import { WebshopService } from '../webshop/webshop.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { EmailService } from '../email/email.service';
import { PurchaseRepository } from '../purchase/purchase.repository';
import { ModuleService } from '../module/module.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  constructor(
    private readonly saleService: SaleService,
    private readonly webshopService: WebshopService,
    private readonly rabbitMQService: RabbitMQService,
    private readonly emailService: EmailService,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly moduleService: ModuleService,
    private readonly productService: ProductService,
  ) {}

  async onModuleInit() {
    await this.rabbitMQService.consumeWebshopOrderCreated(this.handleWebshopOrderCreated.bind(this));
    await this.rabbitMQService.consumeOrderStatusUpdated(this.handleOrderStatusUpdated.bind(this));
    await this.rabbitMQService.consumeProductCreated(this.handleProductCreated.bind(this));
  }

  private async handleWebshopOrderCreated(msg: { order_id: string }): Promise<void> {
    const remarks = `Magento Order #${msg.order_id}`;
    const checkOrderExist = await this.saleService.findAll({
      where: {
        remarks: { contains: remarks },
      },
    });
    if (checkOrderExist?.data?.length) {
      return;
    }

    const {
      customer, transport, products,
    } = await this.webshopService.fetchOrderById(msg.order_id);
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
      remarks: `${remarks}\r\n`,
      transport,
    });

    await this.saleService.addProducts(order.id, products
      .filter(({ nexxus_id }) => !!nexxus_id)
      .map(({ nexxus_id, quantity }) => ({ productId: parseInt(nexxus_id, 10), quantity })));
  }

  private async handleOrderStatusUpdated(
    { orderId, previousStatusId }: { orderId: number; previousStatusId: number },
    properties: MessageProperties,
  ): Promise<void> {
    if (!Number.isFinite(orderId) || !Number.isFinite(previousStatusId)) return;

    const order: any = await this.purchaseRepository.findOne({
      where: { id: orderId },
      select: {
        pickup: true, delivery: true, order_date: true, order_nr: true, contact_aorder_supplier_idTocontact: true, order_status: true,
      },
    });

    if (!order) {
      Logger.error(`ConsumerService.handleOrderStatusUpdated: order not found ${orderId}`);
      return;
    }

    if (order.order_nr.includes('TEMP')) {
      const retryCount = properties?.headers?.['x-retry-count'] || 0;
      if (retryCount <= 5) {
        await this.rabbitMQService.delayOrderStatusUpdated(orderId, previousStatusId, { headers: { 'x-retry-count': retryCount }, persistent: true });
        return;
      }
      Logger.log('Max retries reached, sending to dead-letter queue', 'RabbitMQ');
    }

    const from = (await this.moduleService.getOrderStatusesConfig())?.fromEmailAddress;

    if (!order.order_status.mailbody || !from) {
      return;
    }

    const template = Handlebars.compile(order.order_status.mailbody);

    await this.emailService.send({
      from,
      to: [order.contact_aorder_supplier_idTocontact.email],
      subject: 'Orderstatus bijgewerkt',
      html: template({
        orderNr: order.order_nr,
        pickupDate: order.pickup?.real_pickup_date ? format(order.pickup.real_pickup_date, 'd-MM-Y') : '',
        deliveryDate: order.delivery?.date ? format(order.delivery.date, 'd-MM-Y') : '',
        orderDate: format(order.order_date, 'd-MM-Y H:i'),
        supplierName: order.contact_aorder_supplier_idTocontact?.name,
        customerName: order.contact_aorder_customer_idTocontact?.name,
      }),
      log: true,
    });
  }

  private async handleProductCreated({ productId }: { productId: number }): Promise<void> {
    await this.productService.setProductAsInStock(productId);
  }
}
