import { Injectable } from '@nestjs/common';
import { ModulePaymentRepository } from './module-payment.repository';
import { FindModulePaymentResponseDto } from './dto/find-module-payment-response.dto';
import { ModuleName } from '../module/moduleName.type';
import { Status } from '../payment/types/status';

@Injectable()
export class ModulePaymentService {
  constructor(private readonly repository: ModulePaymentRepository) {}

  async findLastValidModulePaymentByModule(moduleName: string): Promise<FindModulePaymentResponseDto | null> {
    const model = await this.repository.findLastValidModulePaymentByModule(moduleName);

    return model ? {
      id: model.id,
      moduleName: model.module.name as ModuleName,
      method: model.payment.method,
      transactionId: model.payment.transaction_id,
      price: model.price,
      status: model.payment.status as Status,
      active: model.active,
      activeAt: model.active_at,
      expiresAt: model.expires_at,
    } : null;
  }
}
