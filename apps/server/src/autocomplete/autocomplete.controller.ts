import {
  Controller, ForbiddenException, Get, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutocompleteService } from './autocomplete.service';
import { AutocompleteDto, LocationLabelsAutocompleteDto, ProductSubTypesAutocompleteDto } from './dto/autocomplete.dto';
import { AutocompleteResponseDto, LocationAutocompleteResponseDto } from './dto/autocomplete-response.dto';
import { ALL_MAIN_GROUPS, LOCAL_GROUPS, PARTNERS_GROUPS } from '../user/model/group.enum';
import { ConnectedUser, ConnectedUserType } from '../security/decorator/connected-user.decorator';
import { Authorization } from '../security/decorator/authorization.decorator';
import { VAT_CODES } from '../company/const/vat-code';

@ApiBearerAuth()
@Authorization(ALL_MAIN_GROUPS)
@ApiTags('autocomplete')
@Controller('autocomplete')
export class AutocompleteController {
  constructor(protected readonly autocompleteService: AutocompleteService) { }

  @Get('/product-types')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  productTypes(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findProductTypes(query);
  }

  @Get('/product-sub-types')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  productSubTypes(@Query() query: ProductSubTypesAutocompleteDto) {
    return this.autocompleteService.findProductSubTypes(query);
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

  @Get('/contacts')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  contacts(
  @Query() query: AutocompleteDto,
    @ConnectedUser()
    {
      groups,
      email,
    }: ConnectedUserType,
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.autocompleteService.findContacts(query);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.autocompleteService.findContacts(query, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Get('/partners')
  @Authorization(LOCAL_GROUPS)
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  partners(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findPartners(query);
  }

  @Get('/vat-codes')
  @Authorization(LOCAL_GROUPS)
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  vatCodes() {
    return VAT_CODES.map(({ code, label }) => ({ id: code, label }));
  }

  @Get('/companies')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  companies(
  @Query() query: AutocompleteDto,
    @ConnectedUser()
    {
      groups,
      email,
    }: ConnectedUserType,
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.autocompleteService.findCompanies(query);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.autocompleteService.findCompanies(query, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Get('/purchase-statuses')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  purchaseStatuses(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findPurchaseStatuses(query);
  }

  @Get('/sale-statuses')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  salesStatuses(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findSalesStatuses(query);
  }

  @Get('/repair-statuses')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  repairStatuses(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findRepairStatuses(query);
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

  @Get('/drivers')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  drivers(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findDrivers(query);
  }

  @Get('/vehicles')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  vehicles(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findVehicles(query);
  }

  @Get('/locations')
  @ApiResponse({ type: LocationAutocompleteResponseDto, isArray: true })
  locations(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findLocations(query);
  }

  @Get('/location-labels')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  locationLabels(@Query() query: LocationLabelsAutocompleteDto) {
    return this.autocompleteService.findLocationLabels(query);
  }

  @Get('/product-statuses')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  productStatuses(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findProductStatuses(query);
  }
}
