import { AutocompleteRepository } from './autocomplete.repository';
import { AutocompleteDto } from './dto/autocomplete.dto';
import { AutocompleteCompanyDto } from './dto/autocomplete.company.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AutocompleteService {
  constructor(protected readonly repository: AutocompleteRepository) {}

  async findProductTypes(autocompleteDto: AutocompleteDto) {
    return this.repository.findProductTypes(autocompleteDto);
  }

  async findTasks(autocompleteDto: AutocompleteDto) {
    return this.repository.findTasks(autocompleteDto);
  }

  async findAttributes(autocompleteDto: AutocompleteDto) {
    return this.repository.findAttributes(autocompleteDto);
  }

  async findCompanies(autocompleteDto: AutocompleteCompanyDto) {
    return this.repository.findCompanies(autocompleteDto);
  }

  async findPurchaseStatuses(autocompleteDto: AutocompleteCompanyDto) {
    return this.repository.findPurchaseStatuses(autocompleteDto);
  }

  async findSaleStatuses(autocompleteDto: AutocompleteCompanyDto) {
    return this.repository.findSaleStatuses(autocompleteDto);
  }

  async findCustomers(autocompleteDto: AutocompleteCompanyDto) {
    return this.repository.findCustomers(autocompleteDto);
  }

  async findSuppliers(autocompleteDto: AutocompleteCompanyDto) {
    return this.repository.findSuppliers(autocompleteDto);
  }

  async findLogistics(autocompleteDto: AutocompleteCompanyDto) {
    return this.repository.findLogistics(autocompleteDto);
  }

  async findLocations(autocompleteDto: AutocompleteCompanyDto) {
    return this.repository.findLocations(autocompleteDto);
  }

  async findProductStatuses(autocompleteDto: AutocompleteCompanyDto) {
    return this.repository.findProductStatuses(autocompleteDto);
  }
}
