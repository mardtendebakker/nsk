import { Controller, Get, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutocompleteService } from './autocomplete.service';
import { AutocompleteDto } from './dto/autocomplete.dto';
import { AutocompleteResponseDto, LocationAutocompleteResponseDto } from './dto/autocomplete-response.dto';
import { Authorization, AuthorizationGuard, CognitoUser } from '@nestjs-cognito/auth';
import { ALL_MAIN_GROUPS, CognitoGroups, INTERNAL_GROUPS, PARTNERS_GROUPS } from '../common/types/cognito-groups.enum';

@ApiBearerAuth()
@Authorization(ALL_MAIN_GROUPS)
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
  companies(
    @Query() query: AutocompleteDto,
    @CognitoUser(["groups", "email"])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    }
  ) {
    if (groups.some(group=> INTERNAL_GROUPS.includes(group))) {
      return this.autocompleteService.findCompanies(query);
    } else if (groups.some(group=> PARTNERS_GROUPS.includes(group))) {
      return this.autocompleteService.findCompanies(query, email);
    } else {
      throw new UnauthorizedException("only MAIN GROUPs have access to this api!");
    }
  }

  @Get('/partners')
  @UseGuards(AuthorizationGuard(INTERNAL_GROUPS))
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  partners(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findPartners(query);
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

  @Get('/logistics')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  logistics(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findLogistics(query);
  }

  @Get('/locations')
  @ApiResponse({ type: LocationAutocompleteResponseDto, isArray: true })
  locations(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findLocations(query);
  }

  @Get('/product-statuses')
  @ApiResponse({ type: AutocompleteResponseDto, isArray: true })
  productStatuses(@Query() query: AutocompleteDto) {
    return this.autocompleteService.findProductStatuses(query);
  }
}
