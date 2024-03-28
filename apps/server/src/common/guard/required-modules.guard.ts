import {
  Injectable, CanActivate, ExecutionContext, ForbiddenException,
} from '@nestjs/common';
import { ModulePaymentService } from '../../module_payment/module_payment.service';
import { ModuleName } from '../../module/module.service';

export function requiredModule(moduleName: ModuleName) {
  @Injectable()
  class RequiredModule implements CanActivate {
    constructor(private modulePaymentService: ModulePaymentService) {}

    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      const foundModule = await this.modulePaymentService.findLastValidModulePaymentByModule({ name: moduleName, price: 0 });

      if (foundModule) {
        return (request);
      }

      throw new ForbiddenException(`The following module is not active: ${moduleName}`);
    }
  }

  return RequiredModule;
}
