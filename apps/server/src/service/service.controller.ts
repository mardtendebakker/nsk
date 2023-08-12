import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceService } from './service.service';
import { AOrderController } from '../aorder/aorder.controller';

@ApiTags('services')
@Controller('services')
export class ServiceController extends AOrderController {
  constructor(protected readonly serviceService: ServiceService) {
    super(serviceService);
  }
}
