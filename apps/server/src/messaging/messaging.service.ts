import { Injectable, Logger } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { SaleService } from '../sale/sale.service';
import { WebshopService } from '../webshop/webshop.service';
import { ProductService } from '../product/product.service';
import { WebshopProductService } from '../aproduct/webshopProduct/webshopProduct.service';
import { EntityStatus } from '../common/types/entity-status.enum';

let conn;
let ch1;
let ch2;

const publishProductQueue = 'publish_product_to_store';
const magentoOrderCreated = 'magento_order_created';
const exchange = 'nexxus';
const logNonConnected = () => Logger.error('Please call connect function at the beggining of the app execution.');

@Injectable()
export class MessagingService {
  constructor(
    private saleService: SaleService,
    private webshopService: WebshopService,
    private productService: ProductService,
    private webshopProductService: WebshopProductService,
  ) {}

  publishProductToStore(productId: number): void {
    try {
      if (!ch1) {
        logNonConnected();
        return;
      }

      ch1.sendToQueue(publishProductQueue, Buffer.from(JSON.stringify({ productId })));
    } catch (e) {
      Logger.error(e);
    }
  }

  consume<Payload>(cb: (msg: Payload) => Promise<void> | void, queue): void {
    if (!ch2) {
      logNonConnected();
      return;
    }

    ch2.consume(queue, async (msg) => {
      try {
        if (msg !== null) {
          await cb(JSON.parse(msg.content.toString()));
          ch2.ack(msg);
        } else {
          Logger.log('Consumer cancelled by server');
        }
      } catch (e) {
        Logger.error(e);
      }
    });
  }

  consumeWebshopOrderCreated(): void {
    this.consume<string>(async (message) => {
      const msg = JSON.parse(message);
      const { customer, transport, products } = await this.webshopService.fetchOrderById(msg.orderId);
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
        .filter(({ nexxusId }) => !!nexxusId)
        .map(({ nexxusId }) => parseInt(nexxusId, 10)));
    }, magentoOrderCreated);
  }

  consumeProductPublished(): void {
    this.consume<{ productId: number }>(
      async (msg) => {
        const foundProduct = await this.productService.findOneRelation(msg.productId);

        if (!foundProduct || foundProduct.entity_status === EntityStatus.Webshop) {
          return;
        }

        const availableQuantity = this.productService.processStock(foundProduct).sale;
        if (true) {
          await this.webshopService.addProduct(foundProduct, availableQuantity);
          await this.productService.updateOne(msg.productId, { entity_status: EntityStatus.Webshop });
        }
      },
      publishProductQueue,
    );
  }

  public static async connect() {
    if (conn) {
      Logger.error('Messaging connection already initialized.');
      return;
    }

    try {
      conn = await amqplib.connect(process.env.RABBITMQ_DSN);
      ch1 = await conn.createChannel();
      const ch1queue = ch1.assertQueue(publishProductQueue);
      ch1.assertExchange(exchange, 'topic');
      ch1.bindQueue(ch1queue.queue, exchange);

      ch2 = await conn.createChannel();
      const ch2queue = ch2.assertQueue(magentoOrderCreated);
      ch2.assertExchange(exchange, 'topic');
      ch2.bindQueue(ch2queue.queue, exchange);
    } catch (e) {
      conn = undefined;
      ch1 = undefined;
      ch2 = undefined;
      Logger.error(e);
    }
  }
}
