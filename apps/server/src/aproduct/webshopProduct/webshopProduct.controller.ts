import {
  Body, Controller, ForbiddenException, HttpStatus, Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebshopProductService } from './webshopProduct.service';
import { AproductController } from '../aproduct.controller';
import { WebshopProductBlancco } from './webshopProduct.blancco';
import { ConnectedUser, ConnectedUserType } from '../../security/decorator/connected-user.decorator';
import { STORE_PUBLISHER_GROUPS } from '../../user/model/group.enum';
import { SecurityService } from '../../security/service/security.service';

@ApiTags('aproducts-webshop')
@Controller('aproducts/webshop')
export class WebshopProductController extends AproductController {
  constructor(
    protected readonly webshopProductService: WebshopProductService,
    protected readonly webshopProductBlancco: WebshopProductBlancco,
    protected readonly securityService: SecurityService,
  ) {
    super(webshopProductService, webshopProductBlancco, securityService);
  }

  @Post('bulk/publish-to-store')
  @ApiResponse({ status: HttpStatus.OK })
  publishToStore(
    @Body() ids: number[],
      @ConnectedUser() { groups }: ConnectedUserType,
  ): Promise<string> {
    if (!groups.some((group) => STORE_PUBLISHER_GROUPS.includes(group))) {
      throw new ForbiddenException('Insufficient permissions to access this api!');
    }

    return this.webshopProductService.publishToStore(ids);
  }
}
