import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindOrderQueryDto } from './dto/find-order-query.dto';
import { FindOrderResponeDto } from './dto/find-order-response.dto';
import { OrderService } from './order.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get('')
  @ApiResponse({isArray: true, type: FindOrderResponeDto})
  findAll(@Query() findOrderDto: FindOrderQueryDto) {
    if (findOrderDto?.order_nr) {
      return this.orderService.getOrders(findOrderDto);
    }
  }
}
