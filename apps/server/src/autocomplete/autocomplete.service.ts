import { AutocompleteRepository } from './autocomplete.repository';
import { AutocompleteDto, LocationLabelsAutocompleteDto } from './dto/autocomplete.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AutocompleteService {
  constructor(protected readonly repository: AutocompleteRepository) { }

  async findProductTypes(autocompleteDto: AutocompleteDto) {
    return this.repository.findProductTypes(autocompleteDto);
  }

  async findTasks(autocompleteDto: AutocompleteDto) {
    return this.repository.findTasks(autocompleteDto);
  }

  async findAttributes(autocompleteDto: AutocompleteDto) {
    return this.repository.findAttributes(autocompleteDto);
  }

  async findContacts(autocompleteDto: AutocompleteDto, email?: string) {
    return this.repository.findContacts(autocompleteDto, email);
  }

  async findPartners(autocompleteDto: AutocompleteDto) {
    return this.repository.findPartners(autocompleteDto);
  }

  async findCompanies(autocompleteDto: AutocompleteDto, email?: string) {
    return this.repository.findCompanies(autocompleteDto, email);
  }

  async findPurchaseStatuses(autocompleteDto: AutocompleteDto) {
    return this.repository.findPurchaseStatuses(autocompleteDto);
  }

  async findSalesStatuses(autocompleteDto: AutocompleteDto) {
    return this.repository.findSalesStatuses(autocompleteDto);
  }

  async findRepairStatuses(autocompleteDto: AutocompleteDto) {
    return this.repository.findRepairStatuses(autocompleteDto);
  }

  async findCustomers(autocompleteDto: AutocompleteDto) {
    return this.repository.findCustomers(autocompleteDto);
  }

  async findSuppliers(autocompleteDto: AutocompleteDto) {
    return this.repository.findSuppliers(autocompleteDto);
  }

  async findLogistics(autocompleteDto: AutocompleteDto) {
    return this.repository.findLogistics(autocompleteDto);
  }

  async findLocations(autocompleteDto: AutocompleteDto) {
    return this.repository.findLocations(autocompleteDto);
  }

  async findLocationLabels(autocompleteDto: LocationLabelsAutocompleteDto) {
    return this.repository.findLocationLabels(autocompleteDto);
  }

  async findProductStatuses(autocompleteDto: AutocompleteDto) {
    return this.repository.findProductStatuses(autocompleteDto);
  }
}
