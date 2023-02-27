import { Authentication } from "@nestjs-cognito/auth";
import { Body, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { FindOrdersResponeDto } from "./dto/find-order-response.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderEntity } from "./entities/order.entity";
import { FindManyDto } from "../common/dto/find-many.dto";

@ApiBearerAuth()
@Authentication()
export class OrderController {
  constructor(protected readonly orderService: OrderService) {}
  @Get('')
  @ApiResponse({isArray: true, type: FindOrdersResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.orderService.findAll(query);
  }

  @Post('')
  @ApiResponse({type: OrderEntity})
  create(@Body() body: CreateOrderDto) {
    return this.orderService.create(body);
  }

  @Get(':id')
  @ApiResponse({type: OrderEntity})
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({type: OrderEntity})
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }
}
