import { Authentication } from "@nestjs-cognito/auth";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LocationService } from "./location.service";
import { FindLocationsResponeDto } from "./dto/find-location-response.dto";
import { FindManyDto } from "./dto/find-many.dto";

@ApiBearerAuth()
@Authentication()
@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(protected readonly locationService: LocationService) {}
  @Get('')
  @ApiResponse({isArray: true, type: FindLocationsResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.locationService.findAll(query);
  }
}
