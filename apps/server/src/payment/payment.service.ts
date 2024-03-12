import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { FindManyDto } from './dto/find-many.dto';
import { FindManyPaymentResponseDto } from './dto/find-many-payment-response.dto';
import { createMollieClient } from '@mollie/api-client';
import { ConfigService } from '@nestjs/config';
import { SetupDto } from './dto/setup.dto';
import { ModuleName, ModuleService } from '../module/module.service';
import { add, format } from 'date-fns';
import { PAID, PENDING, Status } from './status';

const FREE_TRIAL = 'free_trial';

@Injectable()
export class PaymentService {
  private mollieClient;

  constructor(
    private readonly repository: PaymentRepository,
    private readonly moduleService: ModuleService,
    private readonly configService: ConfigService
  ) {
    this.mollieClient = createMollieClient({ apiKey: this.configService.get<string>('MOLLIE_API_KEY') });
  }

  async findAll(query: FindManyDto): Promise<FindManyPaymentResponseDto> {
   const {count, data} = await this.repository.findAll({
    select: {
      id: true,
      method: true,
      amount: true,
      transaction_id: true,
      subscription_id: true,
      status: true,
      created_at: true,
      updated_at: true,
      module_payments: true
    },
    where: {
      method: { not : { equals: FREE_TRIAL } },
      module_payments: {
        some: {
          module_name: {equals: query.moduleName},
        }
      },
    },
    orderBy: {
      created_at: 'desc'
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
      modules: payment.module_payments.map((modulePayment)=> ({
        id: modulePayment.id,
        name: modulePayment.module_name,
        price: modulePayment.price,
        activeAt: modulePayment.active_at,
        expiresAt: modulePayment.expires_at,
      })),
     })),
    count,
   }
  }

  async setup(body: SetupDto) {
    const amount = this.moduleService.calculateTotalAmount(body.modules);

    if(amount < 1) {
      throw new Error('Invalid payment');
    }

    const formattedAmount = amount.toFixed(2);
    const dateNow = new Date();

    const mollieResponse = await this.mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: formattedAmount
      },
      sequenceType: 'first',
      description: body.modules.toString(),
      redirectUrl: body.redirectUrl,
      customerId: this.configService.get<string>('MOLLIE_CUSTOMER_ID'),
      webhookUrl: this.configService.get<string>('MOLLIE_WEBHOOK'),
    });

    await this.repository.create({
      data: {
        amount: parseFloat(formattedAmount),
        status: PENDING,
        transaction_id: mollieResponse.id,
        module_payments: {
          createMany : {
            data: body.modules.map((moduleName) => ({
              module_name: moduleName,
              price: this.moduleService.findOneByName(moduleName).price,
              active_at: dateNow,
              expires_at: add(dateNow, {months: 1, days: 1}),
            }))
          }
        }
      }
    })

    return mollieResponse;
  }

  async freeTrial(moduleName: ModuleName){
    const dateNow = new Date();

    const { data } = await this.repository.findAll({
      where: {
        method: FREE_TRIAL,
        module_payments: {
          some: {
            module_name: moduleName
          }
        }
      }
    });

    if(data.length > 0) {
      throw new ConflictException('Trial aleady requested for the module: '+ moduleName);
    }

    await this.repository.create({
      data: {
        amount: 0,
        status: PAID,
        method: FREE_TRIAL,
        transaction_id: '',
        module_payments: {
          create: {
            module_name: moduleName,
            price: 0,
            active_at: dateNow,
            expires_at: add(dateNow, { days: 14 }),
          }
        }
      }
    })
  }

  async updateMollieTransaction(transactionId: string){
    const payment = await this.mollieClient.payments.get(transactionId);

    if (payment.status == PAID) {
      await this.repository.updateToPaidStatus({ transactionId: payment.metadata?.transaction_id || transactionId, method: payment.method });
    }
    //TODO handle other known statuses
  }

  async createMollieSubscription(id: number) {
    const payment = await this.repository.findOne(id);

    if(!payment) {
      throw new NotFoundException('Payment not found');
    }

    const subscription = await this.mollieClient.customerSubscriptions.create({
      customerId: this.configService.get<string>('MOLLIE_CUSTOMER_ID'),
      amount: {
        currency: 'EUR',
        value: payment.amount.toFixed(2)
      },
      startDate: format(add(payment.created_at, {months: 1},), 'yyyy-MM-dd'),
      interval: '1 months',
      description: 'Initial transaction ' + payment.transaction_id,
      webhookUrl: this.configService.get<string>('MOLLIE_WEBHOOK'),
      metadata: {
        paymentId: payment.id,
        initialTransaction: payment.transaction_id
      }
    });

    return this.repository.update({ data: {subscription_id: subscription.id}, where: { id } });
  }

  async deleteMollieSubscription(id: number){
    const payment = await this.repository.findOne(id);

    if(!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.mollieClient.customerSubscriptions.cancel(payment.subscription_id, {
      customerId: this.configService.get<string>('MOLLIE_CUSTOMER_ID')
    });

    return this.repository.update({ data: {subscription_id: null}, where: { id } });
  }
}
