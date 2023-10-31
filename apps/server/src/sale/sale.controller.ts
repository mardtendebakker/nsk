import { Body, Controller, Delete, Param, Post, Put, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { AOrderController } from '../aorder/aorder.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportDto } from './dto/import-dto';
import { AuthorizationGuard, CognitoUser } from '@nestjs-cognito/auth';
import { CognitoGroups, MANAGER_GROUPS, SALE_UPLOADER_GROUPS } from '../common/types/cognito-groups.enum';
@ApiTags('sales')
@Controller('sales')
export class SaleController extends AOrderController {
  constructor(protected readonly saleService: SaleService) {
    super(saleService);
  }

  @Put(':id/products')
  @ApiBody({ type: [Number], description: 'Array of product IDs' })
  addProducts(@Param('id') id: number, @Body() productIds: number[]) {
    return this.saleService.addProducts(id, productIds);
  }

  @Delete(':id/products')
  @ApiBody({ type: [Number], description: 'Array of product IDs' })
  removeProducts(@Param('id') id: number, @Body() productIds: number[]) {
    return this.saleService.removeProducts(id, productIds);
  }

  @Post('import')
  @UseGuards(AuthorizationGuard(SALE_UPLOADER_GROUPS))
  @UseInterceptors(FileInterceptor('file'))
  importSales(
    @Body() body: ImportDto,
    @UploadedFile() file: Express.Multer.File,
    @CognitoUser(["groups", "email"])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    }
  ) {
    if (groups.some(group=> MANAGER_GROUPS.includes(group))) {
      return this.saleService.import(body, file);
    } else if (groups.some(group=> [CognitoGroups.PARTNER_SALE_UPLOADER].includes(group))) {
      return this.saleService.import(body, file, email);
    } else {
      throw new UnauthorizedException("only SALE_UPLOADERs have access to this api!");
    }
  }
}
