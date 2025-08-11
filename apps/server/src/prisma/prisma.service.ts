import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { ActivityLogging, Price100, PurchaseOrderStatus, StockManagment } from './prisma.extension';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel> implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly cls: ClsService,
  ) {
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
    Object.assign(
      this,
      this
        .$extends(PurchaseOrderStatus(this.rabbitMQService, this))
        .$extends(Price100())
        .$extends(ActivityLogging(this.cls, this))
        .$extends(StockManagment(this.rabbitMQService)),
    );
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      app.close();
    });
  }
}
