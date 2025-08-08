import {
  Injectable, Logger, OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfirmChannel } from 'amqplib';
import amqp, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { ConfigService } from '@nestjs/config';
import { PublishOptions } from 'amqp-connection-manager/dist/types/ChannelWrapper';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: AmqpConnectionManager;

  private purchaseOrderStatusUpdatedChannel: ChannelWrapper;

  private delayPurchaseOrderStatusUpdatedChannel: ChannelWrapper;

  private magentoPaymentPaidChannel: ChannelWrapper;

  private readonly URI: string;

  private readonly MAGENTO_PAYMENT_PAID: string;

  private readonly PURCHASE_ORDER_STATUS_UPDATED_QUEUE: string;

  private readonly EXCHANGE: string;

  private readonly DELAY_PURCHASE_ORDER_STATUS_UPDATED_QUEUE: string;

  private readonly DELAY_EXCHANGE: string;

  private readonly logger = new Logger(RabbitMQService.name);

  private readonly PURCHASE_ORDER_STATUS_UPDATED_ROUTING_KEY: string;

  constructor(private readonly configService: ConfigService) {
    this.URI = this.configService.get<string>('RABBITMQ_URI');
    this.MAGENTO_PAYMENT_PAID = this.configService.get<string>('RABBITMQ_MAGENTO_PAYMENT_PAID');
    this.PURCHASE_ORDER_STATUS_UPDATED_QUEUE = this.configService.get<string>('RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_QUEUE');
    this.EXCHANGE = this.configService.get<string>('RABBITMQ_EXCHANGE');
    this.DELAY_PURCHASE_ORDER_STATUS_UPDATED_QUEUE = this.configService.get<string>('RABBITMQ_DELAY_PURCHASE_ORDER_STATUS_UPDATED_QUEUE');
    this.DELAY_EXCHANGE = this.configService.get<string>('RABBITMQ_DELAY_EXCHANGE');
    this.PURCHASE_ORDER_STATUS_UPDATED_ROUTING_KEY = this.configService.get<string>('RABBITMQ_PURCHASE_ORDER_STATUS_UPDATED_ROUTING_KEY');
  }

  async onModuleInit() {
    await this.startDelayPurchaseOrderStatusUpdated();
  }

  async purchaseOrderStatusUpdated(orderId: number, previousStatusId: number): Promise<void> {
    await this.pushToQueue(this.purchaseOrderStatusUpdatedChannel, this.PURCHASE_ORDER_STATUS_UPDATED_QUEUE, JSON.stringify({ orderId, previousStatusId }));
  }

  async delayPurchaseOrderStatusUpdated(orderId: number, previousStatusId: number, publishOptions: PublishOptions): Promise<void> {
    await this.pushToQueue(this.delayPurchaseOrderStatusUpdatedChannel, this.DELAY_PURCHASE_ORDER_STATUS_UPDATED_QUEUE, JSON.stringify({ orderId, previousStatusId }), publishOptions);
  }

  async consumePurchaseOrderStatusUpdated(onMessage: (msg, properties) => void) {
    try {
      this.connection = amqp.connect([this.URI]);
      this.purchaseOrderStatusUpdatedChannel = this.connection.createChannel({
        json: true,
        setup: (channel: ConfirmChannel) => this.setupQueue({
          channel,
          exchange: this.EXCHANGE,
          type: 'topic',
          queue: this.PURCHASE_ORDER_STATUS_UPDATED_QUEUE,
          routingKey: this.PURCHASE_ORDER_STATUS_UPDATED_ROUTING_KEY,
          onSetup: () => {
            this.pullFromQueue(this.purchaseOrderStatusUpdatedChannel, this.PURCHASE_ORDER_STATUS_UPDATED_QUEUE, onMessage);
          },
        }),
      });
    } catch (err) {
      this.logger.debug('RabbitMQ:', err);
    }
  }

  async startDelayPurchaseOrderStatusUpdated() {
    try {
      this.connection = amqp.connect([this.URI]);
      this.delayPurchaseOrderStatusUpdatedChannel = this.connection.createChannel({
        json: true,
        setup: (channel: ConfirmChannel) => this.setupQueue({
          channel,
          exchange: this.DELAY_EXCHANGE,
          type: 'direct',
          queue: this.DELAY_PURCHASE_ORDER_STATUS_UPDATED_QUEUE,
          delay: {
            ttl: 1000,
            dlx: this.EXCHANGE,
            dlk: this.PURCHASE_ORDER_STATUS_UPDATED_ROUTING_KEY,
          },
          onSetup: () => {
            this.logger.log('DELAY_PURCHASE_ORDER_STATUS_UPDATED_QUEUE STARTED!');
          },
        }),
      });
    } catch (err) {
      this.logger.debug('RabbitMQ:', err);
    }
  }

  async publishOrderFromStore(orderId: string): Promise<void> {
    await this.pushToQueue(this.magentoPaymentPaidChannel, this.MAGENTO_PAYMENT_PAID, JSON.stringify({ order_id: orderId }));
  }

  async consumeWebshopOrderCreated(onMessage: (msg, properties) => void) {
    try {
      this.connection = amqp.connect([this.URI]);
      this.magentoPaymentPaidChannel = this.connection.createChannel({
        json: true,
        setup: (channel: ConfirmChannel) => this.setupQueue({
          channel,
          exchange: this.EXCHANGE,
          type: 'topic',
          queue: this.MAGENTO_PAYMENT_PAID,
          onSetup: () => {
            this.pullFromQueue(this.magentoPaymentPaidChannel, this.MAGENTO_PAYMENT_PAID, onMessage);
          },
        }),
      });
    } catch (err) {
      this.logger.debug('RabbitMQ:', err);
    }
  }

  private async setupQueue({
    channel, exchange, type, queue, delay, routingKey, onSetup,
  }: { channel: ConfirmChannel,
    exchange: string,
    type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match',
    queue: string,
    delay?: {
      ttl: number,
      dlx: string,
      dlk: string
    },
    routingKey?: string,
    onSetup: () => void
  }) {
    try {
      await channel.assertExchange(exchange, type, { durable: true });
      await channel.assertQueue(queue, {
        durable: true,
        autoDelete: false,
        exclusive: false,
        ...(delay && {
          arguments: {
            'x-message-ttl': delay.ttl,
            'x-dead-letter-exchange': delay.dlx,
            'x-dead-letter-routing-key': delay.dlk,
          },
        }),
      });
      await channel.bindQueue(queue, exchange, routingKey ?? '');
      onSetup();
    } catch (err) {
      this.logger.debug('Error occuered setting up the queues.', err);
    }
  }

  private async pushToQueue(channelWrapper: ChannelWrapper, queue: string, text: string, publishOptions: PublishOptions = {}) {
    try {
      await channelWrapper.sendToQueue(queue, text, publishOptions);
      this.logger.log(`-- message pushed to queue ${queue} --`);
    } catch (err) {
      this.logger.debug(`-- error pushing message to queue ${queue} --`, err);
    }
  }

  private async pullFromQueue(channelWrapper: ChannelWrapper, queue: string, onMessage: (msg: any, properties: any) => void) {
    await channelWrapper.addSetup((channel: ConfirmChannel) => channel.consume(queue, (msg) => {
      if (msg !== null) {
        onMessage(JSON.parse(JSON.parse(msg.content.toString())), msg.properties);
        channel.ack(msg);
      }
    }));
  }

  async onModuleDestroy() {
    await this.connection.close();
  }
}
