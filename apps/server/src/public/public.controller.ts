import { Body, Controller, Get, Post, Query, Render, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
  create(
    @Body() body: PostPickupDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    console.log(body, files);

    return this.publicService.postPickup(body, files);
  }
}
