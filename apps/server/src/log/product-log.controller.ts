import {
  Controller, Get, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindManyDto } from './dto/find-many.dto';
import { LOGISTICS_GROUPS } from '../user/model/group.enum';
import { Authorization } from '../security/decorator/authorization.decorator';
import { ProductLogService } from './product-log.service';
import { FindProductLogsResponseDto } from './dto/find-product-log-response.dto';

@ApiBearerAuth()
@Authorization(LOGISTICS_GROUPS)
@ApiTags('Product logs')
@Controller('logs/products')
export class ProductLogController {
  constructor(protected readonly productLogService: ProductLogService) {}

  @Get()
  @ApiResponse({ type: FindProductLogsResponseDto })
  findAll(@Query() query: FindManyDto) {
    return this.productLogService.findAll(query);
  }
}

