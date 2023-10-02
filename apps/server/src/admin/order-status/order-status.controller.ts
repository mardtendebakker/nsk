import { Authentication } from "@nestjs-cognito/auth";
import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderStatusService } from "./order-status.service";
import { FindOrderStatusesResponeDto } from "./dto/find-order-status-response.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { OrderStatusEntity } from "./entities/order-status.entity";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";

@ApiBearerAuth()
@Authentication()
@ApiTags('admin order statuses')
@Controller('admin/order-statuses')
export class OrderStatusController {
  constructor(protected readonly orderStatusService: OrderStatusService) {}
  @Get('')
  @ApiResponse({type: FindOrderStatusesResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.orderStatusService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({type: OrderStatusEntity})
  findOne(@Param('id') id: number) {
    return this.orderStatusService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({type: OrderStatusEntity})
  update(@Param('id') id: number, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.orderStatusService.update(id, updateOrderStatusDto);
  }
}
