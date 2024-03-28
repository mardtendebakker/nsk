import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AServiceController } from '../aservice/aservice.controller';
import { SalesServiceService } from './sales-service.service';

@ApiTags('sales-services')
@Controller('sales-services')
export class SalesServiceController extends AServiceController {
  constructor(protected readonly salesServiceService: SalesServiceService) {
    super(salesServiceService);
  }
}
