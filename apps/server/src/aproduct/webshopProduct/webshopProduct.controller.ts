import {
  Body, Controller, HttpStatus, Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebshopProductService } from './webshopProduct.service';
import { AproductController } from '../aproduct.controller';
import { WebshopProductBlancco } from './webshopProduct.blancco';
import { RabbitMQService } from '../../rabbitmq/rabbitmq.service';

@ApiTags('aproducts-webshop')
@Controller('aproducts/webshop')
export class WebshopProductController extends AproductController {
  constructor(
    protected readonly webshopProductService: WebshopProductService,
    protected readonly webshopProductBlancco:WebshopProductBlancco,
    protected readonly rabbitMQService: RabbitMQService,
  ) {
    super(webshopProductService, webshopProductBlancco);
  }

  @Post('bulk/publish-to-store')
  @ApiResponse({ status: HttpStatus.OK })
  async publishToStore(@Body() ids: number[]): Promise<boolean> {
    await Promise.all(ids.map(async (id) => this.rabbitMQService.publishProductToStore(id)));
    return true;
  }
}
