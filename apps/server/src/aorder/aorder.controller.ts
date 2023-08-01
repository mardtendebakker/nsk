import { Authentication } from "@nestjs-cognito/auth";
import { 
  Get, Post, Put, Patch, Delete,
  Body, Param, Query,
  HttpStatus, Res, StreamableFile
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { AOrderService } from "./aorder.service";
import { CreateAOrderDto } from "./dto/create-aorder.dto";
import { FindAOrdersResponeDto } from "./dto/find-aorder-response.dto";
import { UpdateAOrderDto } from "./dto/update-aorder.dto";
import { AOrderEntity } from "./entities/aorder.entity";
import { FindManyDto } from "./dto/find-many.dto";
import { UpdateManyAOrderDto } from "./dto/update-many-aorder.dto";
import { UpdateManyResponseAOrderDto } from "./dto/update-many-aorder-response.dts";
import type { Response } from 'express';
import { BulkPrintDTO } from "./dto/bulk-print.dto";

@ApiBearerAuth()
@Authentication()
export class AOrderController {
  constructor(protected readonly aorderService: AOrderService) {}
  @Get('')
  @ApiResponse({type: FindAOrdersResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.aorderService.findAll(query);
  }

  @Post('')
  @ApiResponse({type: AOrderEntity})
  create(@Body() body: CreateAOrderDto) {
    return this.aorderService.create(body);
  }

  @Get(':id')
  @ApiResponse({type: AOrderEntity})
  findOne(@Param('id') id: number) {
    return this.aorderService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({type: AOrderEntity})
  update(@Param('id') id: number, @Body() updateAOrderDto: UpdateAOrderDto) {
    return this.aorderService.update(id, updateAOrderDto);
  }

  @Patch('')
  @ApiResponse({type: UpdateManyResponseAOrderDto})
  updateMany(@Body() updateManyAOrderDto: UpdateManyAOrderDto) {
    return this.aorderService.updateMany(updateManyAOrderDto)
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number) {
    return this.aorderService.deleteOne(id);
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
  async printAOrders(@Query() bulkPrintDTO: BulkPrintDTO, @Res({ passthrough: true }) res: Response) {
    const { ids } = bulkPrintDTO;
    const pdfStream = await this.aorderService.printAOrders(ids);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="orders.pdf"',
    });
    return new StreamableFile(pdfStream);
  }
}
