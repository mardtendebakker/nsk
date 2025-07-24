import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel> implements OnModuleInit {
  constructor(private rabbitMQService: RabbitMQService) {
    super();
    // TODO: prisma middleware for updateAt
    /*
      Solves the Do not know how to serialize a BigInt issue
    */
    (BigInt.prototype as any).toJSON = function () {
      return Number(this);
    };
  }

  async onModuleInit() {
    await this.$connect();

    const multiplyPriceBy100 = <T extends { [key: string]: any }>(obj: T): T => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (key === 'price' && Number.isFinite(value)) {
            obj[key] = Math.ceil(value * 100) as T[Extract<keyof T, string>];
          } else if (typeof value === 'object') {
            obj[key] = multiplyPriceBy100(value);
          }
        }
      }
      return obj;
    };

    const dividePriceBy100 = <T extends { [key: string]: any }>(obj: T): T => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (key === 'price') {
            if (Number.isFinite(value)) {
              obj[key] = Number((value / 100).toFixed(2)) as T[Extract<keyof T, string>];
            } else {
              obj[key] = 0 as T[Extract<keyof T, string>];
            }
          } else if (typeof value === 'object') {
            obj[key] = dividePriceBy100(value);
          }
        }
      }
      return obj;
    };

    Object.assign(
      this,
      this.$extends({
        query: {
          aorder: {
            update: async ({ args, query }) => {
              const order = await this.aorder.findFirst({ where: { ...args.where, discr: 'p' } });
              const result = await query(args);

              if (order && result.status_id != order.status_id) {
                await this.rabbitMQService.purchaseOrderStatusUpdated(order.id, order.status_id);
              }

              return result;
            },
            updateMany: async ({ args, query }) => {
              const orders = await this.aorder.findMany({ where: { ...args.where, discr: 'p' } });
              const result = await query(args);
              const updatedOrders = await this.aorder.findMany({ where: { id: { in: orders.map(({ id }) => id) } } });

              for (const order of orders) {
                for (const updatedOrder of updatedOrders) {
                  if ((updatedOrder.id == order.id) && (updatedOrder.status_id != order.status_id)) {
                    this.rabbitMQService.purchaseOrderStatusUpdated(order.id, order.status_id);
                  }
                }
              }

              return result;
            },
          },
          async $allOperations({
            model, operation, args, query,
          }) {
            if (
              [
                'create',
                'createMany',
                'update',
                'updateMany',
                'upsert',
              ].includes(operation)
            ) {
              args.data = multiplyPriceBy100(args.data);
              const result = await query(args);
              return dividePriceBy100(result);
            }

            if (
              [
                'find',
                'findMany',
                'findFirst',
                'findFirstOrThrow',
                'findUnique',
                'findUniqueOrThrow',
              ].includes(operation)
            ) {
              const result = await query(args);
              return dividePriceBy100(result);
            }

            return query(args);
          },
        },
      }),
    );
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      app.close();
    });
  }
}
