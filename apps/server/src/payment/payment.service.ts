import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { createMollieClient } from '@mollie/api-client';
import { ConfigService } from '@nestjs/config';
import { add, format } from 'date-fns';
import { PaymentRepository } from './payment.repository';
import { FindManyDto } from './dto/find-many.dto';
import { FindManyPaymentResponseDto } from './dto/find-many-payment-response.dto';
import { SetupDto } from './dto/setup.dto';
import { ModuleService } from '../module/module.service';
import { PAID, PENDING, Status } from './status';

const FREE_TRIAL = 'free_trial';

@Injectable()
export class PaymentService {
  private mollieClient;

  constructor(
    private readonly repository: PaymentRepository,
    private readonly moduleService: ModuleService,
    private readonly configService: ConfigService,
  ) {
    this.mollieClient = createMollieClient({ apiKey: this.configService.get<string>('MOLLIE_API_KEY') });
  }

  async findAll(query: FindManyDto): Promise<FindManyPaymentResponseDto> {
    const { count, data } = await this.repository.findAll({
      select: {
        id: true,
        method: true,
        amount: true,
        transaction_id: true,
        subscription_id: true,
        status: true,
        created_at: true,
        updated_at: true,
        module_payment: {
          select: {
            id: true,
            price: true,
            active_at: true,
            expires_at: true,
            module: true,
          },
        },
      },
      where: {
        OR: [
          {
            method: { not: { equals: FREE_TRIAL } },
            module_payment: {
              some: {
                module: {
                  name: { equals: query.moduleName },
                },
              },
            },
          }, {
            method: { equals: null },
            module_payment: {
              some: {
                module: {
                  name: { equals: query.moduleName },
                },
              },
            },
          },
        ],
      },
      orderBy: {
        created_at: 'desc',
      },
      take: query.take,
      skip: query.skip,
    });

    return {
      data: data.map((payment) => ({
        id: payment.id,
        method: payment.method,
        transactionId: payment.transaction_id,
        subscriptionId: payment.subscription_id,
        amount: payment.amount,
        status: payment.status as Status,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
        modules: payment.module_payment.map((modulePayment) => ({
          id: modulePayment.id,
          // @ts-ignore
          name: modulePayment.module.name,
          price: modulePayment.price,
          activeAt: modulePayment.active_at,
          expiresAt: modulePayment.expires_at,
        })),
      })),
      count,
    };
  }

  async setup(body: SetupDto) {
    const modules = (await this.moduleService.findAll()).filter((module) => body.moduleIds.find((e) => e === module.id));

    const amount = modules.reduce((a, b) => a + b.price, 0);

    if (amount < 1) {
      throw new Error('Invalid payment');
    }

    const formattedAmount = amount.toFixed(2);
    const dateNow = new Date();

    const mollieResponse = await this.mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: formattedAmount,
      },
      sequenceType: 'first',
      description: modules.map(({ name }) => name).toString(),
      redirectUrl: body.redirectUrl,
      customerId: this.configService.get<string>('MOLLIE_CUSTOMER_ID'),
      webhookUrl: this.configService.get<string>('MOLLIE_WEBHOOK'),
    });

    await this.repository.create({
      data: {
        amount: parseFloat(formattedAmount),
        status: PENDING,
        transaction_id: mollieResponse.id,
        module_payment: {
          createMany: {
            data: body.moduleIds.map((moduleId) => ({
              module_id: moduleId,
              price: modules.find((module) => moduleId === module.id).price,
              active_at: dateNow,
              expires_at: add(dateNow, { months: 1, days: 1 }),
            })),
          },
        },
      },
    });

    return mollieResponse;
  }

  async freeTrial(moduleId: number) {
    const dateNow = new Date();

    const { data } = await this.repository.findAll({
      where: {
        method: FREE_TRIAL,
        module_payment: {
          some: {
            module: {
              id: moduleId,
            },
          },
        },
      },
    });

    if (data.length > 0) {
      throw new ConflictException('Trial aleady requested for this module.');
    }

    await this.repository.create({
      data: {
        amount: 0,
        status: PAID,
        method: FREE_TRIAL,
        transaction_id: '',
        module_payment: {
          create: {
            module_id: moduleId,
            price: 0,
            active_at: dateNow,
            expires_at: add(dateNow, { days: 14 }),
          },
        },
      },
    });
  }

  async updateMollieTransaction(transactionId: string) {
    const payment = await this.mollieClient.payments.get(transactionId);

    if (payment.status == PAID) {
      if (payment.subscriptionId) {
        await this.repository.updateToPaidStatusBySubscriptionId({ subscriptionId: payment.subscriptionId, method: payment.method });
      } else {
        await this.repository.updateToPaidStatusByTransactionId({ transactionId, method: payment.method });
      }
    }
    // TODO handle other known statuses
  }

  async createMollieSubscription(id: number) {
    const payment = await this.repository.findOne(id);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const subscription = await this.mollieClient.customerSubscriptions.create({
      customerId: this.configService.get<string>('MOLLIE_CUSTOMER_ID'),
      amount: {
        currency: 'EUR',
        value: payment.amount.toFixed(2),
      },
      startDate: format(add(payment.created_at, { months: 1 }), 'yyyy-MM-dd'),
      interval: '1 months',
      description: `Initial transaction ${payment.transaction_id}`,
      webhookUrl: this.configService.get<string>('MOLLIE_WEBHOOK'),
    });

    return this.repository.update({ data: { subscription_id: subscription.id }, where: { id } });
  }

  async deleteMollieSubscription(id: number) {
    const payment = await this.repository.findOne(id);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.mollieClient.customerSubscriptions.cancel(payment.subscription_id, {
      customerId: this.configService.get<string>('MOLLIE_CUSTOMER_ID'),
    });

    return this.repository.update({ data: { subscription_id: null }, where: { id } });
  }
}
