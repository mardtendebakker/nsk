import {
  Body, Controller, ForbiddenException, HttpStatus, Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CognitoUser } from '@nestjs-cognito/auth';
import { WebshopProductService } from './webshopProduct.service';
import { AproductController } from '../aproduct.controller';
import { WebshopProductBlancco } from './webshopProduct.blancco';
import { RabbitMQService } from '../../rabbitmq/rabbitmq.service';
import { CognitoGroups, STORE_PUBLISHER_GROUPS } from '../../common/types/cognito-groups.enum';

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
  async publishToStore(
    @Body() ids: number[],
      @CognitoUser(['groups'])
      {
        groups,
      }: {
        groups: CognitoGroups[];
      },
  ): Promise<boolean> {
    if (!groups.some((group) => STORE_PUBLISHER_GROUPS.includes(group))) {
      throw new ForbiddenException('Insufficient permissions to access this api!');
    }

    await Promise.all(ids.map(async (id) => this.rabbitMQService.publishProductToStore(id)));
    return true;
  }
}
