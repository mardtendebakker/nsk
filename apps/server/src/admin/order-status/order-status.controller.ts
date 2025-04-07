import {
  Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderStatusService } from './order-status.service';
import { FindOrderStatusesResponeDto } from './dto/find-order-status-response.dto';
import { FindManyDto } from './dto/find-many.dto';
import { OrderStatusEntity } from './entities/order-status.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CreateOrderStatusDto } from './dto/create-order-status.dto';
import { requiredModule } from '../../common/guard/required-modules.guard';
import { MANAGER_GROUPS } from '../../user/model/group.enum';
import { Authorization } from '../../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(MANAGER_GROUPS)
@ApiTags('admin order statuses')
@Controller('admin/order-statuses')
export class OrderStatusController {
  constructor(protected readonly orderStatusService: OrderStatusService) {}

  @Get('')
  @ApiResponse({ type: FindOrderStatusesResponeDto })
  findAll(@Query() query: FindManyDto) {
    return this.orderStatusService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ type: OrderStatusEntity })
  @UseGuards(requiredModule('order_statuses'))
  findOne(@Param('id') id: number) {
    return this.orderStatusService.findOne(id);
  }

  @Post('')
  @ApiResponse({ type: OrderStatusEntity })
  @UseGuards(requiredModule('order_statuses'))
  create(@Body() createOrderStatusDto: CreateOrderStatusDto) {
    return this.orderStatusService.create(createOrderStatusDto);
  }

  @Put(':id')
  @ApiResponse({ type: OrderStatusEntity })
  @UseGuards(requiredModule('order_statuses'))
  update(@Param('id') id: number, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.orderStatusService.update(id, updateOrderStatusDto);
  }

  @Delete(':id')
  @UseGuards(requiredModule('order_statuses'))
  delete(@Param('id') id: number) {
    return this.orderStatusService.delete(id);
  }
}
