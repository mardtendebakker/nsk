import {
  Body, Controller, HttpStatus, Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebshopProductService } from './webshopProduct.service';
import { AproductController } from '../aproduct.controller';
import { WebshopProductBlancco } from './webshopProduct.blancco';
import { MessagingService } from '../../messaging/messaging.service';

@ApiTags('aproducts-webshop')
@Controller('aproducts/webshop')
export class WebshopProductController extends AproductController {
  constructor(
    protected readonly webshopService: WebshopProductService,
    protected readonly webshopBlancco:WebshopProductBlancco,
    protected readonly messagingService: MessagingService,
  ) {
    super(webshopService, webshopBlancco);
  }

  @Post('bulk/publish-to-store')
  @ApiResponse({ status: HttpStatus.OK })
  publishToStore(@Body() ids: number[]) {
    ids.forEach((id) => {
      this.messagingService.publishProductToStore(id);
    });
  }
}
