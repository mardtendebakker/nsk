import { Controller, Post } from '@nestjs/common';
import { RepairService } from './repair.service';
import { AOrderController } from '../aorder/aorder.controller';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('repairs')
@Controller('repairs')
export class RepairController extends AOrderController {
  constructor(protected readonly repairService: RepairService) {
    super(repairService);
  }

  @ApiExcludeEndpoint()
  create() {
    return this.repairService.create();
  }

  @Post('')
  createRepair() {
    return this.repairService.create();
  }
}
