import { Authentication } from "@nestjs-cognito/auth";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PickupService } from "./pickup.service";
import { FindPickupsResponeDto } from "./dto/find-all-pickup-response.dto";
import { FindManyDto } from "../dto/find-many.dto";

@ApiBearerAuth()
@Authentication()
@ApiTags('calendar-pickups')
@Controller('calendar/pickups')
export class PickupController {
  constructor(protected readonly pickupService: PickupService) {}
  @Get('')
  @ApiResponse({type: FindPickupsResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.pickupService.findAll(query);
  }
}
