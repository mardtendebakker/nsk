import { Authorization, AuthorizationGuard, CognitoUser } from '@nestjs-cognito/auth';
import {
  Body,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { FindOneProductResponeDto } from './dto/find-one-product-response.dto';
import { FindProductsResponseDto } from './dto/find-product-respone.dto';
import { StockService } from './stock.service';
import { UpdateBodyStockDto } from './dto/update-body-stock.dto';
import { UpdateManyProductResponseDto } from './dto/update-many-product-response.dto';
import { UpdateManyProductDto } from './dto/update-many-product.dto';
import { FindManyDto } from './dto/find-many.dto';
import { CreateBodyStockDto } from './dto/create-body-stock.dto';
import { BulkPrintDTO } from '../print/dto/bulk-print.dto';
import {
  ALL_MAIN_GROUPS,
  CognitoGroups,
  LOCAL_GROUPS,
  MANAGER_GROUPS,
  PARTNERS_GROUPS,
  SUPER_ADMIN_GROUPS,
} from '../common/types/cognito-groups.enum';
import { StockBlancco } from './stock.blancco';
import { requiredModule } from '../common/guard/required-modules.guard';
import { UploadProductDto } from './dto/upload-product.dto';

@ApiBearerAuth()
@Authorization(ALL_MAIN_GROUPS)
export class StockController {
  constructor(
    protected readonly stockService: StockService,
    protected readonly stockBlancco: StockBlancco,
  ) {}

  @Get('')
  @ApiResponse({ type: FindProductsResponseDto })
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
      return this.stockService.findAll(query);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.stockService.findAll(query, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Get(':id')
  @UseGuards(AuthorizationGuard(LOCAL_GROUPS))
  @ApiResponse({ type: FindOneProductResponeDto })
  findOne(@Param('id') id: number) {
    return this.stockService.findOneCustomSelect(id);
  }

  @Post('')
  @UseGuards(AuthorizationGuard(LOCAL_GROUPS))
  @UseInterceptors(AnyFilesInterceptor())
  @ApiResponse({ type: FindOneProductResponeDto })
  create(
  @Body() body: CreateBodyStockDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.stockService.create(body, files);
  }

  @Put(':id')
  @UseGuards(AuthorizationGuard(LOCAL_GROUPS))
  @UseInterceptors(AnyFilesInterceptor())
  @ApiResponse({ type: FindOneProductResponeDto })
  updateOne(
  @Param('id') id: number,
    @Body() body: UpdateBodyStockDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.stockService.updateOne(id, body, files);
  }

  @Patch('')
  @UseGuards(AuthorizationGuard(MANAGER_GROUPS))
  @ApiResponse({ type: UpdateManyProductResponseDto })
  updateMany(@Body() updateManyProductDto: UpdateManyProductDto) {
    return this.stockService.updateMany(updateManyProductDto);
  }

  @Patch('archive/all-sold-out')
  @UseGuards(AuthorizationGuard(SUPER_ADMIN_GROUPS))
  @ApiResponse({ type: UpdateManyProductResponseDto })
  archiveAllSoldOut() {
    return this.stockService.archiveAllSoldOut();
  }

  @Delete(':id')
  @UseGuards(AuthorizationGuard(MANAGER_GROUPS))
  deleteOne(@Param('id') id: number) {
    return this.stockService.deleteOne(id);
  }

  @Get('bulk/print/barcodes')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Barcodes pdf',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async printBarcodes(@Query() bulkPrintDTO: BulkPrintDTO, @Res({ passthrough: true }) res: Response) {
    const { ids } = bulkPrintDTO;
    const pdfStream = await this.stockService.printBarcodes(ids);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="barcodes.pdf"',
    });
    return new StreamableFile(pdfStream);
  }

  @Get('bulk/print/checklists')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Checklist pdf',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async printChecklists(@Query() bulkPrintDTO: BulkPrintDTO, @Res({ passthrough: true }) res: Response) {
    const { ids } = bulkPrintDTO;
    const pdfStream = await this.stockService.printChecklists(ids);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="checklists.pdf"',
    });
    return new StreamableFile(pdfStream);
  }

  @Get('bulk/print/pricecards')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'PriceCard pdf',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async printPriceCards(@Query() bulkPrintDTO: BulkPrintDTO, @Res({ passthrough: true }) res: Response) {
    const { ids } = bulkPrintDTO;
    const pdfStream = await this.stockService.printPriceCards(ids);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="pricecards.pdf"',
    });
    return new StreamableFile(pdfStream);
  }

  @Get('bulk/print/labels')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Label pdf',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async printLabels(
  @Query() bulkPrintDTO: BulkPrintDTO,
    @Res({ passthrough: true }) res: Response,
    @CognitoUser(['gender', 'given_name', 'family_name'])
    {
      gender,
      given_name,
      family_name,
    }: {
      gender: string;
      given_name: string;
      family_name: string;
    },
  ) {
    const { ids } = bulkPrintDTO;
    const pdfStream = await this.stockService.printLabels({
      ids,
      user: {
        gender,
        given_name,
        family_name,
      },
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="labels.pdf"',
    });
    return new StreamableFile(pdfStream);
  }

  @Patch('blancco/:orderId')
  @UseGuards(AuthorizationGuard(LOCAL_GROUPS))
  @UseGuards(requiredModule('blancco'))
  async importFromBlancco(@Param('orderId') orderId: number) {
    const count = await this.stockBlancco.importFromBlancco(orderId);

    return { count };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
  @Body() body: UploadProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const products = await this.stockService.uploadFromExcel(body, file);

    return { count: products.length };
  }
}
