import { Authentication } from "@nestjs-cognito/auth";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductStatusService } from "./product-status.service";
import { FindProductStatusesResponeDto } from "./dto/find-product-status-response.dto";
import { FindManyDto } from "./dto/find-many.dto";

@ApiBearerAuth()
@Authentication()
@ApiTags('product statuses')
@Controller('product-statuses')
export class ProductStatusController {
  constructor(protected readonly productStatusService: ProductStatusService) {}
  @Get('')
  @ApiResponse({isArray: true, type: FindProductStatusesResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.productStatusService.findAll(query);
  }
}
