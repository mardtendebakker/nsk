import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RepairService } from './repair.service';
import { SaleController } from '../sale/sale.controller';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@ApiTags('repairs')
@Controller('repairs')
export class RepairController extends SaleController {
  constructor(
    protected readonly repairService: RepairService,
    protected readonly rabbitMQService: RabbitMQService,
  ) {
    super(repairService, rabbitMQService);
  }
}
