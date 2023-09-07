import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutocompleteService } from './autocomplete.service';
import { AutocompleteDto } from './dto/autocomplete.dto';
import { AutocompleteResponseDto } from './dto/autocomplete-response.dto';
import { Authentication } from '@nestjs-cognito/auth';

@ApiBearerAuth()
@Authentication()
@ApiTags('autocomplete')
@Controller('autocomplete')
export class AutocompleteController {
  constructor(protected readonly autocompleteService: AutocompleteService) {}

  @Get('/product-types')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  productTypes(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findProductTypes(query);
  }

  @Get('/tasks')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  tasks(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findTasks(query);
  }

  @Get('/attributes')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  attributes(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findAttributes(query);
  }

  @Get('/companies')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  companies(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findCompanies(query);
  }

  @Get('/order-statuses')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  orderStatuses(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findOrderStatuses(query);
  }

  @Get('/customers')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  customers(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findCustomers(query);
  }

  @Get('/suppliers')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  suppliers(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findSuppliers(query);
  }

  @Get('/logistics')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  logistics(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findLogistics(query);
  }

  @Get('/locations')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  locations(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findLocations(query);
  }

  @Get('/product-statuses')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  productStatuses(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findProductStatuses(query);
  }
}
