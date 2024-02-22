import { Injectable } from '@nestjs/common';
import { FindModuleResponseDto } from './dto/find-module-response.dto';
import { ModulePaymentService } from '../module_payment/module_payment.service';

export type ModuleName = 'blancco' | 'customer_contact_action' | 'logistics' | 'attributes' | 'tasks' | 'product_statuses' | 'order_statuses' | 'tracking';

export interface Module {
  name: ModuleName;
  price: number;
}

export const MODULES: Module[] = [{
  name: 'blancco',
  price: 19.95
},{
  name: 'customer_contact_action',
  price: 9.95
},{
  name: 'logistics',
  price: 19.95
},{
  name: 'attributes',
  price: 4.95
},{
  name: 'tasks',
  price: 4.95
},{
  name: 'product_statuses',
  price: 4.95
},{
  name: 'order_statuses',
  price: 4.95
},{
  name: 'tracking',
  price: 4.95
}];
 
@Injectable()
export class ModuleService {
  constructor(private readonly modulePaymentService: ModulePaymentService) {}

  async findAll(): Promise<FindModuleResponseDto[]> {
    const result: FindModuleResponseDto[] = [];
    const dateNow = new Date();

    for (const m of MODULES) {
      const payment = await this.modulePaymentService.findLastValidModulePaymentByModule(m);

      result.push({
        name: m.name,
        price: payment?.price || m.price,
        activeAt: payment?.activeAt || null,
        expiresAt: payment?.expiresAt || null,
        active: dateNow > payment?.activeAt && dateNow < payment?.expiresAt,
        freeTrialUsed: false
      })
    }

    return result;
  }

  findOneByName(modulleName: ModuleName): Module|null {
    return MODULES.find(({name}) => name == modulleName);
  }

  calculateTotalAmount(modules: string[]): number {
    let amount = 0;

    for (const module of modules) {
      const price = MODULES.find((element) => element.name == module)?.price || 0;

      if(price <= 1) {
        throw new Error('Invalid module name:'+ module);
      }

      amount += price;
    }

    return amount;
  }
}
