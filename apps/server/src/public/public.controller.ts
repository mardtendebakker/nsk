import { Body, Controller, Get, Post, Query, Render, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { PublicService } from './public.service';
import { ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { GetPickupDto } from './dto/get-pickup.dto';
import { PostPickupDto } from './dto/post-pickup.dto';

@ApiTags('public')
@Controller('public')
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
    const form = this.publicService.getForm();
    
    return {
      ...query,
      allProductTypes,
      dataDestructionChoices,
      form,
    };
  }

  @Post('pickup')
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() body: PostPickupDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    await this.publicService.postPickup(body, files);

    if (body.pickup_form.confirmPage) {
      res.redirect(body.pickup_form.confirmPage);
    } else {
      res.send('Pickup added successfully');
    }
  }
}
