// src/prisma/extensions/audit-logging.extension.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

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

export function PurchaseOrderStatus(rabbitMQService: RabbitMQService, prisma: PrismaClient) {
  return Prisma.defineExtension({
    name: 'purchase-order-status',
    query: {
      aorder: {
        update: async ({ args, query }) => {
          const order = await prisma.aorder.findFirst({ where: { ...args.where } });
          const result = await query(args);

          if (order && result.status_id != order.status_id) {
            rabbitMQService.orderStatusUpdated(order.id, order.status_id);
          }

          return result;
        },
        updateMany: async ({ args, query }) => {
          const orders = await prisma.aorder.findMany({ where: { ...args.where } });
          const result = await query(args);
          const updatedOrders = await prisma.aorder.findMany({ where: { id: { in: orders.map(({ id }) => id) } } });

          for (const order of orders) {
            for (const updatedOrder of updatedOrders) {
              if ((updatedOrder.id == order.id) && (updatedOrder.status_id != order.status_id)) {
                rabbitMQService.orderStatusUpdated(order.id, order.status_id);
              }
            }
          }

          return result;
        },
        create: async ({ args, query }) => {
          const order = await query(args);
          rabbitMQService.orderStatusUpdated(order.id, order.status_id);

          return order;
        },
      },
    },
  });
}

export function Price100() {
  return Prisma.defineExtension({
    name: 'price100',
    query: {
      async $allOperations({
        operation, args, query,
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
  });
}

export function ActivityLogging(cls: ClsService, prisma: PrismaClient) {
  const IGNORED_MODELS = ['email_log', 'activity_log', 'user_group', 'stock'];
  const INCLUDED_OPERATIONS = ['create', 'createMany', 'update', 'updateMany', 'delete', 'deleteMany'];
  function buildSelectFromData(data: any): any {
    if (!data || typeof data !== 'object') return true;

    const select: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Check for nested updates (e.g., update: { ... })
        if ('update' in value || 'set' in value || 'connect' in value) {
          select[key] = true;
        }
      } else {
        select[key] = true;
      }
    }

    return select;
  }

  return Prisma.defineExtension({
    name: 'audit-logging',
    query: {
      async $allOperations({
        model, operation, args, query,
      }) {
        if (IGNORED_MODELS.includes(model)) return query(args);
        if (!INCLUDED_OPERATIONS.includes(operation)) return query(args);

        const data: Prisma.activity_logUncheckedCreateInput = {
          username: cls.get('username'),
          userGroups: {
            connectOrCreate: (cls.get('groups') ?? []).map((name) => ({
              where: { name },
              create: { name },
            })),
          },
          method: cls.get('method'),
          route: cls.get('route'),
          params: JSON.stringify(cls.get('params')),
          body: JSON.stringify(cls.get('body')),
          model,
          action: operation,
          query: JSON.stringify(args),
          bulk: ['createMany', 'updateMany', 'deleteMany'].includes(operation),
        };

        try {
          if (['create', 'createMany'].includes(operation)) {
            const result = await query(args);

            prisma.activity_log.create({
              data: {
                ...data,
              },
            }).catch((e) => console.log(e.message));

            return result;
          }

          if (['update', 'updateMany'].includes(operation)) {
            const before = await prisma[model].findMany({
              where: args.where,
              select: buildSelectFromData(args.data),
            });
            const result = await query(args);

            prisma.activity_log.create({
              data: {
                ...data,
                before: before ? JSON.stringify(before) : null,
              },
            }).catch((e) => console.log(e.message));

            return result;
          }

          if (['delete', 'deleteMany'].includes(operation)) {
            const before = await prisma[model].findFirst({
              where: args.where,
            });
            const result = await query(args);

            prisma.activity_log.create({
              data: {
                ...data,
                before: before ? JSON.stringify(before) : null,
              },
            }).catch((e) => console.log(e.message));

            return result;
          }

          // Other operations (find, count, etc.)
          return await query(args);
        } catch (e) {
          return query(args); // fail-safe fallback
        }
      },
    },
  });
}

export function StockManagment(rabbitMQService: RabbitMQService) {
  return Prisma.defineExtension({
    name: 'stock-managment',
    query: {
      product: {
        create: async ({ args, query }) => {
          const product = await query(args);
          try {
            rabbitMQService.productCreated(product.id);
          } catch (e) { console.log(e.message); }
          return product;
        },
        createMany: async ({ args, query }) => {
          const products = await query(args);
          try {
            const records = Array.isArray(args.data) ? args.data : [args.data];
            for (const record of records) {
              rabbitMQService.productCreated(record.id);
            }
          } catch (e) { console.log(e.message); }
          return products;
        },
      },
    },
  });
}
