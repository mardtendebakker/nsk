import { Authentication } from "@nestjs-cognito/auth";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderStatusService } from "./order-status.service";
import { FindOrderStatusesResponeDto } from "./dto/find-order-status-response.dto";
import { FindManyDto } from "./dto/find-many.dto";

@ApiBearerAuth()
@Authentication()
@ApiTags('order statuses')
@Controller('order-statuses')
export class OrderStatusController {
  constructor(protected readonly orderStatusService: OrderStatusService) {}
  @Get('')
  @ApiResponse({isArray: true, type: FindOrderStatusesResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.orderStatusService.findAll(query);
  }
}
