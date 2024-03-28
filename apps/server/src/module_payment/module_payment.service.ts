import { Injectable } from '@nestjs/common';
import { ModulePaymentRepository } from './module_payment.repository';
import { Module, ModuleName } from '../module/module.service';
import { FindModulePaymentResponseDto } from './dto/find-module-payment-response.dto';

export const PAID = 'paid';
export const PENDING = 'pending';
export const REFUNDED = 'refunded';

export type Status = 'paid' | 'pending' | 'refunded';

@Injectable()
export class ModulePaymentService {
  constructor(private readonly repository: ModulePaymentRepository) {}

  async findLastValidModulePaymentByModule(moduleName: Module): Promise<FindModulePaymentResponseDto | null> {
    const model = await this.repository.findLastValidModulePaymentByModule(moduleName);

    return model ? {
      id: model.id,
      moduleName: model.module_name as ModuleName,
      method: model.payment.method,
      transactionId: model.payment.transaction_id,
      price: model.price,
      status: model.payment.status as Status,
      activeAt: model.active_at,
      expiresAt: model.expires_at,
    } : null;
  }
}
