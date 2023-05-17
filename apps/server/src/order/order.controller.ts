import { Authentication } from "@nestjs-cognito/auth";
import { 
  Get, Post, Put, Patch, Delete,
  Body, Param, Query,
  HttpStatus, Res, StreamableFile
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { FindOrdersResponeDto } from "./dto/find-order-response.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderEntity } from "./entities/order.entity";
import { FindManyDto } from "./dto/find-many.dto";
import { UpdateManyOrderDto } from "./dto/update-many-order.dto";
import { UpdateManyResponseOrderDto } from "./dto/update-many-order-response.dts";
import type { Response } from 'express';
import { BulkPrintDTO } from "./dto/bulk-print.dto";

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

  @Patch('')
  @ApiResponse({type: UpdateManyResponseOrderDto})
  updateMany(@Body() updateManyOrderDto: UpdateManyOrderDto) {
    return this.orderService.updateMany(updateManyOrderDto)
  }

  @Delete('')
  deleteMany(@Body() ids: number[]) {
    return this.orderService.deleteMany(ids);
  }

  @Get('bulk/print')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders pdf',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async printOrders(@Query() bulkPrintDTO: BulkPrintDTO, @Res({ passthrough: true }) res: Response) {
    const { ids } = bulkPrintDTO;
    const pdfStream = await this.orderService.printOrders(ids);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="orders.pdf"',
    });
    return new StreamableFile(pdfStream);
  }
}
