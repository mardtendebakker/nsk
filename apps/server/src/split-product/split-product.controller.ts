import {
  Body, Controller, Param, Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SplitProductService } from './split-product.service';
import { SplitDto } from './dto/split.dto';
import { LOCAL_GROUPS } from '../user/model/group.enum';
import { Authorization } from '../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(LOCAL_GROUPS)
@ApiTags('split-product')
@Controller('split-product')
export class SplitProductController {
  constructor(protected readonly splitProductService: SplitProductService) {}

  @Put(':id/split-part-of-bundle')
  splitPartOfBundle(
  @Param('id') id: number,
    @Body() body: SplitDto,
  ) {
    return this.splitProductService.splitPartOfBundle(id, body);
  }

  @Put(':id/individualize-part-of-bundle')
  individualizePartOfBundle(
  @Param('id') id: number,
    @Body() body: SplitDto,
  ) {
    return this.splitProductService.individualizePartOfBundle(id, body);
  }

  @Put(':id/individualize-the-whole-stock')
  individualizeTheWholeStock(
  @Param('id') id: number,
    @Body() body: SplitDto,
  ) {
    return this.splitProductService.individualizeTheWholeStock(id, body);
  }

  @Put(':id/individualize-the-whole-bundle')
  individualizeTheWholeBundle(
  @Param('id') id: number,
    @Body() body: SplitDto,
  ) {
    return this.splitProductService.individualizeTheWholeBundle(id, body);
  }
}
