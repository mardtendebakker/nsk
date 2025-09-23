// src/prisma/extensions/audit-logging.extension.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

export function PrismaExtention({
  prisma, cls, rabbitMQService,
}: {
  prisma: PrismaClient, cls: ClsService, rabbitMQService: RabbitMQService
}) {
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
    name: 'prisma-extension',
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
          query: JSON.stringify(['delete', 'deleteMany'].includes(operation) ? args.where : args.data),
          bulk: ['createMany', 'updateMany', 'deleteMany'].includes(operation),
        };

        try {
          if (['create', 'createMany'].includes(operation)) {
            let result;

            if (operation === 'create') {
              result = await query(args);
              if (model === 'aorder') {
                rabbitMQService.orderStatusUpdated(result.id, result.status_id);
              }
              if (model === 'product') {
                rabbitMQService.productCreated(result.id);
              }
            }

            if (operation === 'createMany') {
              if (model === 'product') {
                const records = Array.isArray(args.data) ? args.data : [args.data];
                const createdProducts = await Promise.all(
                  records.map((record) => prisma.product.create({ data: record })),
                );

                for (const product of createdProducts) {
                  rabbitMQService.productCreated(product.id);
                }

                result = { count: createdProducts.length };
              } else {
                result = await query(args);
              }
            }

            prisma.activity_log.create({
              data: {
                ...data,
              },
            }).catch((e) => console.log(e.message));

            return result;
          }

          if (['update', 'updateMany'].includes(operation)) {
            let before;
            let result;
            if (operation === 'update') {
              before = await prisma[model].findFirst({
                where: args.where,
                select: buildSelectFromData(args.data),
              });
              result = await query(args);
              if (model === 'aorder' && before && result.status_id != before.status_id) {
                rabbitMQService.orderStatusUpdated(before.id, before.status_id);
              }
            } else if (operation === 'updateMany') {
              before = await prisma[model].findMany({
                where: args.where,
                select: buildSelectFromData(args.data),
              });
              result = await query(args);

              if (model === 'aorder') {
                const updatedOrders = await prisma.aorder.findMany({ where: { id: { in: before.map(({ id }) => id) } } });

                for (const order of before) {
                  for (const updatedOrder of updatedOrders) {
                    if ((updatedOrder.id == order.id) && (updatedOrder.status_id != order.status_id)) {
                      rabbitMQService.orderStatusUpdated(order.id, order.status_id);
                    }
                  }
                }
              }
            }

            prisma.activity_log.create({
              data: {
                ...data,
                before: before ? JSON.stringify(before) : null,
              },
            }).catch((e) => console.log(e.message));

            return result;
          }

          if (['delete', 'deleteMany'].includes(operation)) {
            let before;
            if (operation === 'delete') {
              before = await prisma[model].findFirst({
                where: args.where,
              });
            } else if (operation === 'deleteMany') {
              before = await prisma[model].findMany({
                where: args.where,
              });
            }
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
