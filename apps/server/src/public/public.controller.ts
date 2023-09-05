import { Body, Controller, Get, Post, Query, Render, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { PublicService } from './public.service';
import { ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { GetPickupDto } from './dto/get-pickup.dto';
import { PostPickupDto } from './dto/post-pickup.dto';
import { PostOrderDto } from './dto/post-order.dto';
import { GetOrderDto } from './dto/get-order.dto';

@ApiTags('nsk-public')
@Controller('nsk/public')
export class PublicController {
  constructor(protected readonly publicService: PublicService) {}

  @Get('pickuptest')
  @Render('pickuptest')
  getPickupTest() {
    return {};
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
      res.send('Pickup added successfully');
    }
  }

  @Get('ordertest')
  @Render('ordertest')
  getOrderTest() {
    return {};
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
  async postOrder(
    @Body() body: PostOrderDto,
    @Res() res: Response,
  ) {
    await this.publicService.postOrder(body);

    if (body.public_order_form.confirmPage) {
      res.send(body.public_order_form.confirmPage);
    } else {
      res.send('Order added successfully');
    }
  }
}
