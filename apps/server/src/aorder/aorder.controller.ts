import { Authorization, AuthorizationGuard, CognitoUser } from '@nestjs-cognito/auth';
import {
  Get, Post, Put, Patch, Delete,
  Body, Param, Query,
  HttpStatus, Res, StreamableFile, UseGuards, ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { AOrderService } from './aorder.service';
import { CreateAOrderDto } from './dto/create-aorder.dto';
import { FindAOrdersResponeDto } from './dto/find-aorder-response.dto';
import { UpdateAOrderDto } from './dto/update-aorder.dto';
import { AOrderEntity } from './entities/aorder.entity';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateManyAOrderDto } from './dto/update-many-aorder.dto';
import { UpdateManyResponseAOrderDto } from './dto/update-many-aorder-response.dts';
import { BulkPrintDTO } from '../print/dto/bulk-print.dto';
import {
  CognitoGroups,
  ADMINS_GROUPS,
  ALL_MAIN_GROUPS,
  LOCAL_GROUPS,
  PARTNERS_GROUPS,
} from '../common/types/cognito-groups.enum';

@ApiBearerAuth()
@Authorization(ALL_MAIN_GROUPS)
export class AOrderController {
  constructor(protected readonly aorderService: AOrderService) {}

  @Get('')
  @ApiResponse({ type: FindAOrdersResponeDto })
  findAll(
  @Query() query: FindManyDto,
    @CognitoUser(['groups', 'email'])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    },
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.aorderService.findAll(query);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.aorderService.findAll(query, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Get(':id')
  @ApiResponse({ type: AOrderEntity })
  findOne(
  @Param('id') id: number,
    @CognitoUser(['groups', 'email'])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    },
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.aorderService.findOne(id);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.aorderService.findOne(id, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Post('')
  @UseGuards(AuthorizationGuard(LOCAL_GROUPS))
  @ApiResponse({ type: AOrderEntity })
  create(@Body() body: CreateAOrderDto) {
    return this.aorderService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthorizationGuard(LOCAL_GROUPS))
  @ApiResponse({ type: AOrderEntity })
  update(@Param('id') id: number, @Body() updateAOrderDto: UpdateAOrderDto) {
    return this.aorderService.update(id, updateAOrderDto);
  }

  @Patch('')
  @UseGuards(AuthorizationGuard(LOCAL_GROUPS))
  @ApiResponse({ type: UpdateManyResponseAOrderDto })
  updateMany(@Body() updateManyAOrderDto: UpdateManyAOrderDto) {
    return this.aorderService.updateMany(updateManyAOrderDto);
  }

  @Delete(':id')
  @UseGuards(AuthorizationGuard(ADMINS_GROUPS))
  deleteOne(@Param('id') id: number) {
    return this.aorderService.deleteOne(id);
  }

  @Delete(':id/files')
  @UseGuards(AuthorizationGuard(ADMINS_GROUPS))
  deleteFiles(
  @Param('id') id: number,
    @Body() fileIds: number[],
  ) {
    return this.aorderService.deleteFiles(id, fileIds);
  }

  @Get('bulk/print/normal')
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
  async printAOrders(
  @Query() bulkPrintDTO: BulkPrintDTO,
    @Res({ passthrough: true }) res: Response,
    @CognitoUser(['groups', 'email'])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    },
  ) {
    const { ids } = bulkPrintDTO;

    let pdfStream: Buffer;
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      pdfStream = await this.aorderService.printAOrders(ids);
    } else if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      pdfStream = await this.aorderService.printAOrders(ids, email);
    } else {
      throw new ForbiddenException('Insufficient permissions to access this api!');
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="orders.pdf"',
    });

    return new StreamableFile(pdfStream);
  }

  @Get('bulk/print/export')
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
  async printExport(
  @Query() bulkPrintDTO: BulkPrintDTO,
    @Res({ passthrough: true }) res: Response,
    @CognitoUser(['groups', 'email'])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    },
  ) {
    const { ids } = bulkPrintDTO;

    let pdfStream: Buffer;
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      pdfStream = await this.aorderService.printExport(ids);
    } else if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      pdfStream = await this.aorderService.printExport(ids, email);
    } else {
      throw new ForbiddenException('Insufficient permissions to access this api!');
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="export-declaration.pdf"',
    });

    return new StreamableFile(pdfStream);
  }
}
