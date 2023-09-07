import { Injectable } from '@nestjs/common';
import { AutocompleteDto } from './dto/autocomplete.dto';
import { AutocompleteResponseDto } from './dto/autocomplete-response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AutocompleteCompanyDto } from './dto/autocomplete.company.dto';
import { CompanyDiscrimination } from '../company/types/company-discrimination.enum';
import { LogisticRole } from '../logistic/types/logistic-role.enum';

const DEFAULT_TAKE = 50;

@Injectable()
export class AutocompleteRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findProductTypes(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(autocompleteDto, this.prisma.product_type);
  }

  async findTasks(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(autocompleteDto, this.prisma.task);
  }

  async findAttributes(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(autocompleteDto, this.prisma.attribute);
  }

  async findOrderStatuses(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(autocompleteDto, this.prisma.order_status);
  }

  async findCustomers(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(autocompleteDto, this.prisma.acompany, { discr: CompanyDiscrimination.CUSTOMER });
  }

  async findSuppliers(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(autocompleteDto, this.prisma.acompany, { discr: CompanyDiscrimination.SUPLLIER });
  }

  async findLocations(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(autocompleteDto, this.prisma.location);
  }

  async findProductStatuses(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(autocompleteDto, this.prisma.product_status);
  }

  async findLogistics(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    
    const firstResult = await this.prisma.fos_user.findMany({
      take: DEFAULT_TAKE,
      where: {id: {in: autocompleteDto.ids}, 
      roles: LogisticRole.LOGISTIC_ROLE},
    });

    const secondResult = await this.prisma.fos_user.findMany({
      take: DEFAULT_TAKE,
      where: {
        username: {contains: autocompleteDto.search || ''},
        id: {notIn: firstResult.map(({id}) => id)},
        roles: LogisticRole.LOGISTIC_ROLE
      },
    })

    return [
      ...firstResult,
      ...secondResult
    ]
    .sort((a,b) => a.id > b.id ? 1 : -1)
    .map(({id, username}) => ({id, label: username}));
  }

  async findCompanies(autocompleteDto: AutocompleteCompanyDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(
      autocompleteDto,
      this.prisma.acompany,
      { is_partner: { gt: autocompleteDto.partnerOnly == 1 ? 0 : undefined }}
    );
  }

  private async commonFind(
    autocompleteDto: AutocompleteDto,
    prismaModel,
    additionalWhereCondition = {},
  ): Promise<AutocompleteResponseDto[]> {
    const firstResult = await prismaModel.findMany({
      take: DEFAULT_TAKE,
      where: {id: {in: autocompleteDto.ids}, ...additionalWhereCondition},
    });

    const secondResult = await prismaModel.findMany({
      take: DEFAULT_TAKE,
      where: {
        name: {contains: autocompleteDto.search || ''},
        id: {notIn: firstResult.map(({id}) => id)},
        ...additionalWhereCondition
      },
    })

    return [
      ...firstResult,
      ...secondResult
    ]
    .sort((a,b) => a.id > b.id ? 1 : -1)
    .map(({id, name}) => ({id, label: name}));
  }
}
