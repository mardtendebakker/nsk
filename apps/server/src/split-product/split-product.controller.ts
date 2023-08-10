import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SplitProductService } from './split-product.service';
import { SplitDto } from './dto/split.dto';
import { Authentication } from '@nestjs-cognito/auth';

@ApiBearerAuth()
@Authentication()
@ApiTags('split-product')
@Controller('split-product')
export class SplitProductController {
  constructor(protected readonly splitProductService: SplitProductService) {}

  @Put(':id/split-stockpart')
  splitStockPart(
    @Param('id') id: number,
    @Body() body: SplitDto,
  ) {
    return this.splitProductService.splitStockPart(id, body);
  }

  @Put(':id/individualize-bundle')
  individualizeBundle(
    @Param('id') id: number,
    @Body() body: SplitDto,
  ) {
    return this.splitProductService.individualizeBundle(id, body);
  }
}
