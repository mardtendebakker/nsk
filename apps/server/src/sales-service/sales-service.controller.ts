import { Controller } from '@nestjs/common';
import { AServiceController } from '../aservice/aservice.controller';
import { SalesServiceService } from './sales-service.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sales-services')
@Controller('sales-services')
export class SalesServiceController extends AServiceController {
  constructor(protected readonly salesServiceService: SalesServiceService) {
    super(salesServiceService);
  }
}
