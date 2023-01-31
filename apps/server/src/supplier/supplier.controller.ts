import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindAcompanyQueryDto } from '../common/dto/find-acompany-query.dto';
import { SupplierService } from './supplier.service';

@ApiTags('suppliers')
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}
  @Get('')
  @ApiResponse({isArray: true, type: FindAcompanyQueryDto})
  findAll(@Query() query: FindAcompanyQueryDto) {
    return this.supplierService.getSuppliers(query);
  }
}
