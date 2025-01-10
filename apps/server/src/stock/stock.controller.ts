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
import { StockBlancco } from './stock.blancco';
import { requiredModule } from '../common/guard/required-modules.guard';
import { UploadProductDto } from './dto/upload-product.dto';
import { ConnectedUser, ConnectedUserType } from '../security/decorator/connected-user.decorator';
import {
  ALL_MAIN_GROUPS, LOCAL_GROUPS, MANAGER_GROUPS, PARTNERS_GROUPS, SUPER_ADMIN_GROUPS,
} from '../user/model/group.enum';
import { Authorization } from '../security/decorator/authorization.decorator';
import { SecurityService } from '../security/service/security.service';

@ApiBearerAuth()
@Authorization(ALL_MAIN_GROUPS)
export class StockController {
  constructor(
    protected readonly stockService: StockService,
    protected readonly stockBlancco: StockBlancco,
    protected readonly securityService: SecurityService,
  ) {}

  @Get('')
  @ApiResponse({ type: FindProductsResponseDto })
  findAll(
  @Query() query: FindManyDto,
    @ConnectedUser()
    {
      groups,
      email,
    }: ConnectedUserType,
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.stockService.findAll(query);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.stockService.findAll(query, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Get(':id')
  @Authorization(LOCAL_GROUPS)
  @ApiResponse({ type: FindOneProductResponeDto })
  findOne(@Param('id') id: number) {
    return this.stockService.findOneCustomSelect(id);
  }

  @Post('')
  @Authorization(LOCAL_GROUPS)
  @UseInterceptors(AnyFilesInterceptor())
  @ApiResponse({ type: FindOneProductResponeDto })
  create(
  @Body() body: CreateBodyStockDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.stockService.create(body, files);
  }

  @Put(':id')
  @Authorization(LOCAL_GROUPS)
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
  @Authorization(MANAGER_GROUPS)
  @ApiResponse({ type: UpdateManyProductResponseDto })
  updateMany(@Body() updateManyProductDto: UpdateManyProductDto) {
    return this.stockService.updateMany(updateManyProductDto);
  }

  @Patch('archive/all-sold-out')
  @Authorization(SUPER_ADMIN_GROUPS)
  @ApiResponse({ type: UpdateManyProductResponseDto })
  archiveAllSoldOut() {
    return this.stockService.archiveAllSoldOut();
  }

  @Delete(':id')
  @Authorization(MANAGER_GROUPS)
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
    @ConnectedUser() { username }: ConnectedUserType,
  ) {
    const { ids } = bulkPrintDTO;
    const user = await this.securityService.findOneByUsername(username);
    const pdfStream = await this.stockService.printLabels({
      ids,
      user: {
        gender: user.gender,
        given_name: user.firstName,
        family_name: user.lastName,
      },
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="labels.pdf"',
    });
    return new StreamableFile(pdfStream);
  }

  @Patch('blancco/:orderId')
  @Authorization(LOCAL_GROUPS)
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
