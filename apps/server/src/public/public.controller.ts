import {
  Body, Controller, Get, Headers, Post, Query, Render, Res, UnauthorizedException, UploadedFile, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Response } from 'express';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { PublicService } from './public.service';
import { GetPickupDto } from './dto/get-pickup.dto';
import { PostPickupDto } from './dto/post-pickup.dto';
import { PostOrderDto } from './dto/post-order.dto';
import { GetOrderDto } from './dto/get-order.dto';
import { GetImportDto } from './dto/get-import.dto';
import { PostImportDto } from './dto/post-import.dto';
import { FindProductTypeResponseDto } from '../admin/product-type/dto/find-product-type-response.dto';
import { GetSalesDto } from './dto/get-sales.dto';
import { PostSalesDto } from './dto/post-sales.dto';

@ApiTags('nsk-public')
@Controller('nsk/public')
export class PublicController {
  constructor(protected readonly publicService: PublicService) {}

  @Get('pickuptest')
  @Render('pickuptest')
  getPickupTest() {
    return {};
  }

  @Get('product-types')
  @ApiResponse({ type: [FindProductTypeResponseDto] })
  getProductTypes() {
    return this.publicService.getAllProductTypes();
  }

  @Get('data-destruction-choices')
  @ApiResponse({
    status: 200,
    description: 'Return available data destruction choices',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            'data-destruction-id': { type: 'string', example: 'data-destruction-description' },
          },
        },
      },
    },
  })
  getDataDestructionChoices() {
    const orderedChoices = {};
    this.publicService.getDataDestructionChoices().forEach((value, key) => {
      orderedChoices[key] = value;
    });

    return orderedChoices;
  }

  @Get('pickup')
  @Render('pickup')
  async getPickup(@Query() query: GetPickupDto) {
    const allProductTypes = await this.publicService.getAllProductTypes();
    const dataDestructionChoices = this.publicService.getDataDestructionChoices();
    const form = this.publicService.getPickupForm();

    return {
      ...query,
      allProductTypes,
      dataDestructionChoices,
      form,
    };
  }

  @Post('pickup')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async postPickup(
  @Body() body: PostPickupDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    await this.publicService.postPickup(body, files);

    if (body.pickup_form.confirmPage) {
      res.send(body.pickup_form.confirmPage);
    } else {
      res.send(this.publicService.getPostPickupSuccessMessage());
    }
  }

  @Get('ordertest')
  @Render('ordertest')
  getOrderTest() {
    return {};
  }

  @Get('sales')
  @Render('sales')
  async getSales(@Query() query: GetSalesDto) {
    const form = this.publicService.getSalesForm();

    return {
      ...query,
      form,
    };
  }

  @Get('order')
  @Render('order')
  async getOrder(@Query() query: GetOrderDto) {
    const form = this.publicService.getOrderForm();

    return {
      ...query,
      form,
    };
  }

  @Post('order')
  @ApiConsumes('multipart/form-data')
  async postOrder(
  @Body() body: PostOrderDto,
    @Res() res: Response,
  ) {
    await this.publicService.postOrder(body);

    if (body.public_order_form.confirmPage) {
      res.send(body.public_order_form.confirmPage);
    } else {
      res.send(this.publicService.getPostOrderSuccessMessage());
    }
  }

  @Post('sales')
  @ApiConsumes('multipart/form-data')
  async postSales(
  @Body() body: PostSalesDto,
    @Res() res: Response,
  ) {
    await this.publicService.postSales(body);

    if (body.public_sales_form.confirmPage) {
      res.send(body.public_sales_form.confirmPage);
    } else {
      res.send(this.publicService.getPostSalesSuccessMessage());
    }
  }

  @Get('importleergelddenhaag')
  @Render('importleergelddenhaag')
  getImportLeergeldDenHaag() {
    return {};
  }

  @Get('import')
  @Render('import')
  async getImport(@Query() query: GetImportDto) {
    return {
      ...query,
    };
  }

  @Post('import')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importSales(
  @Body() body: PostImportDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Headers('authorization') authorization,
  ) {
    try {
      if (!authorization) {
        throw new UnauthorizedException('Please enter username and password!');
      }

      await this.publicService.importSales(authorization.replace('Basic ', ''), body, file);
      res.send('Import sales completed successfully');
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        res.setHeader(
          'WWW-Authenticate',
          'Basic realm="Access to site", charset="UTF-8"',
        );
        res.status(401).send('UnauthorizedAccess');
      }

      throw e;
    }
  }
}
