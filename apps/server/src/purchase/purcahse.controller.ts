import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PurcahseService } from './purcahse.service';
import { OrderController } from '../order/order.controller';

@ApiTags('purcahses')
@Controller('purcahses')
export class PurcahseController extends OrderController {
  constructor(protected readonly purcahseService: PurcahseService) {
    super(purcahseService);
  }
}
