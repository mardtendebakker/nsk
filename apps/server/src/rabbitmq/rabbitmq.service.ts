import {
  Injectable, Logger, OnModuleDestroy,
} from '@nestjs/common';
import { ConfirmChannel } from 'amqplib';
import amqp, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleDestroy {
  private connection: AmqpConnectionManager;

  private ch1: ChannelWrapper;

  private readonly URI: string;

  private readonly MAGENTO_PAYMENT_PAID: string;

  private readonly RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_QUEUE: string;

  private readonly EXCHANGE: string;

  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private readonly configService: ConfigService) {
    this.URI = this.configService.get<string>('RABBITMQ_URI');
    this.MAGENTO_PAYMENT_PAID = this.configService.get<string>('RABBITMQ_MAGENTO_PAYMENT_PAID');
    this.RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_QUEUE = this.configService.get<string>('RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_QUEUE');
    this.EXCHANGE = this.configService.get<string>('RABBITMQ_EXCHANGE');
  }

  public async connect(onSetup: () => void | Promise<void>): Promise<void> {
    try {
      this.connection = amqp.connect([this.URI]);
      this.ch1 = this.connection.createChannel({
        json: true,
        setup: (channel: ConfirmChannel) => this.setupQueues(channel, onSetup),
      });
      this.logger.log('*** CONNECTED TO RABBITMQ SERVERE ***');
    } catch (err) {
      this.logger.debug('Error connecting to RabbitMQ:', err);
    }
  }

  private async setupQueues(channel: ConfirmChannel, onSetup: () => void | Promise<void>) {
    try {
      await channel.assertExchange(this.EXCHANGE, 'topic', { durable: true });
      await channel.assertQueue(this.MAGENTO_PAYMENT_PAID, { durable: true });
      await channel.assertQueue(this.RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_QUEUE, { durable: true });
      await channel.bindQueue(this.MAGENTO_PAYMENT_PAID, this.EXCHANGE, this.MAGENTO_PAYMENT_PAID);
      await channel.bindQueue(this.RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_QUEUE, this.EXCHANGE, this.RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_QUEUE);
      await onSetup();
    } catch (err) {
      this.logger.debug('Error occuered setting up the queues.', err);
    }
  }

  async purchaseOrderStatusUpdated(orderId: number, previousStatusId: number): Promise<void> {
    await this.pushToQueue(this.ch1, this.RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_QUEUE, JSON.stringify({ orderId, previousStatusId }));
  }

  async consumePurchaseOrderStatusUpdated(onMessage: (msg) => void) {
    return this.pullFromQueue(this.ch1, this.RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_QUEUE, onMessage);
  }

  async publishOrderFromStore(orderId: string): Promise<void> {
    await this.pushToQueue(this.ch1, this.MAGENTO_PAYMENT_PAID, JSON.stringify({ order_id: orderId }));
  }

  async consumeWebshopOrderCreated(onMessage: (msg) => void) {
    return this.pullFromQueue(this.ch1, this.MAGENTO_PAYMENT_PAID, onMessage);
  }

  private async pushToQueue(channelWrapper: ChannelWrapper, queue: string, text: string) {
    try {
      await channelWrapper.sendToQueue(queue, text);
      this.logger.log(`-- message pushed to queue ${queue} --`);
    } catch (err) {
      this.logger.debug(`-- error pushing message to queue ${queue} --`, err);
    }
  }

  private async pullFromQueue(channelWrapper: ChannelWrapper, queue: string, onMessage: (msg) => void) {
    await channelWrapper.addSetup((channel: ConfirmChannel) => channel.consume(queue, (msg) => {
      if (msg !== null) {
        onMessage(JSON.parse(JSON.parse(msg.content.toString())));
        channel.ack(msg);
      }
    }));
  }

  async onModuleDestroy() {
    await this.connection.close();
  }
}
