import { Body, Controller, Patch } from '@nestjs/common';
import { ArchivedService } from './archived.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AproductController } from '../aproduct.controller';

@ApiTags('aproducts-archive')
@Controller('aproducts/archive')
export class ArchivedController extends AproductController {
  constructor(protected readonly archivedService: ArchivedService) {
    super(archivedService);
  }

  @Patch('set')
  @ApiBody({ type: [Number], description: 'Array of product IDs' })
  archive(@Body() productIds: number[]) {
    return this.archivedService.archive(productIds);
  }

  @Patch('unset')
  @ApiBody({ type: [Number], description: 'Array of product IDs' })
  unarchive(@Body() productIds: number[]) {
    return this.archivedService.unarchive(productIds);
  }
}
