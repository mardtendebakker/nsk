import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { format } from 'date-fns';
import { SaleService } from '../sale/sale.service';
import { WebshopService } from '../webshop/webshop.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { EmailService } from '../email/email.service';
import { PurchaseRepository } from '../purchase/purchase.repository';
import { ModuleService } from '../module/module.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  constructor(
    private saleService: SaleService,
    private webshopService: WebshopService,
    private rabbitMQService: RabbitMQService,
    private emailService: EmailService,
    private purchaseRepository: PurchaseRepository,
    private moduleService: ModuleService,
  ) {}

  async onModuleInit() {
    await this.rabbitMQService.connect(async () => {
      await this.rabbitMQService.consumeWebshopOrderCreated(this.handleWebshopOrderCreated.bind(this));
      await this.rabbitMQService.consumePurchaseOrderStatusUpdated(this.handleOrderStatusUpdated.bind(this));
    });
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

  private async handleOrderStatusUpdated({ orderId }: { orderId: number, previousStatusId: number }): Promise<void> {
    const order: any = await this.purchaseRepository.findOne({
      where: { id: orderId },
      select: {
        pickup: true, order_date: true, order_nr: true, contact_aorder_supplier_idTocontact: true, order_status: true,
      },
    });

    if (!order) {
      Logger.error(`ConsumerService.handleOrderStatusUpdated: order not found ${orderId}`);
      return;
    }

    const from = (await this.moduleService.getOrderStatusConfig()).fromEmailAddress;

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
        orderDate: format(order.order_date, 'd-MM-Y H:i'),
      }),
    });
  }
}
