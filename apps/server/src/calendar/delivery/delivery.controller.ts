import { Authorization } from "@nestjs-cognito/auth";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DeliveryService } from "./delivery.service";
import { FindDeliveriesResponeDto } from "./dto/find-delivery-response.dto";
import { FindManyDto } from "../dto/find-many.dto";
import { LOCAL_GROUPS } from "../../common/types/cognito-groups.enum";

@ApiBearerAuth()
@Authorization(LOCAL_GROUPS)
@ApiTags('calendar-deliveries')
@Controller('calendar/deliveries')
export class DeliveryController {
  constructor(protected readonly deliveryService: DeliveryService) {}
  @Get('')
  @ApiResponse({type: FindDeliveriesResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.deliveryService.findAll(query);
  }
}
