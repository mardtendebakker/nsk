import { Injectable } from '@nestjs/common';
import { AutocompleteDto, LocationLabelsAutocompleteDto, ProductSubTypesAutocompleteDto } from './dto/autocomplete.dto';
import { AutocompleteResponseDto } from './dto/autocomplete-response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Group } from '../user/model/group.enum';

const DEFAULT_TAKE = 50;

@Injectable()
export class AutocompleteRepository {
  constructor(protected readonly prisma: PrismaService) { }

  async findProductTypes(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.product_type,
    });
  }

  async findProductSubTypes(autocompleteDto: ProductSubTypesAutocompleteDto): Promise<AutocompleteResponseDto[]> {
    const additionalWhereCondition = autocompleteDto.product_type_id
      ? { product_type_id: autocompleteDto.product_type_id }
      : {};

    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.product_sub_type,
      additionalWhereCondition,
    });
  }

  async findTasks(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.task,
    });
  }

  async findAttributes(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.attribute,
    });
  }

  async findPurchaseStatuses(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.order_status,
      additionalWhereCondition: { is_purchase: true },
    });
  }

  async findSalesStatuses(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.order_status,
      additionalWhereCondition: { is_sale: true },
    });
  }

  async findRepairStatuses(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.order_status,
      additionalWhereCondition: { is_repair: true },
    });
  }

  async findCustomers(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.contactFind({
      autocompleteDto,
      prismaModel: this.prisma.contact,
      additionalWhereCondition: { company_contact_company_idTocompany: { is_customer: true } },
    });
  }

  async findSuppliers(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.contactFind({
      autocompleteDto,
      prismaModel: this.prisma.contact,
      additionalWhereCondition: { company_contact_company_idTocompany: { is_supplier: true } },
    });
  }

  async findLocations(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    const firstResult = await this.prisma.location.findMany({
      take: DEFAULT_TAKE,
      where: { id: { in: autocompleteDto.ids } },
      include: { location_template: { select: { id: true, template: true } } },
    });

    const secondResult = await this.prisma.location.findMany({
      take: DEFAULT_TAKE,
      where: {
        name: { contains: autocompleteDto.search || '' },
        id: { notIn: firstResult.map(({ id }) => id) },
      },
      include: { location_template: { select: { id: true, template: true } } },
    });

    return [
      ...firstResult,
      ...secondResult,
    ]
      .sort((a, b) => (a.id > b.id ? 1 : -1))
      .map(({ id, name, location_template }) => ({ id, label: name, location_template }));
  }

  async findLocationLabels(autocompleteDto: LocationLabelsAutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.location_label,
      additionalWhereCondition: { location_id: autocompleteDto.location_id },
      searchKey: 'label',
    });
  }

  async findProductStatuses(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.product_status,
    });
  }

  async findDrivers(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    const firstResult = await this.prisma.user.findMany({
      take: DEFAULT_TAKE,
      where: {
        id: { in: autocompleteDto.ids },
        groups: { contains: Group.LOGISTICS },
      },
    });

    const secondResult = await this.prisma.user.findMany({
      take: DEFAULT_TAKE,
      where: {
        username: { contains: autocompleteDto.search || '' },
        id: { notIn: firstResult.map(({ id }) => id) },
        groups: { contains: Group.LOGISTICS },
      },
    });

    return [
      ...firstResult,
      ...secondResult,
    ]
      .sort((a, b) => (a.id > b.id ? 1 : -1))
      .map(({ id, username }) => ({ id, label: username }));
  }

  async findVehicles(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    const firstResult = await this.prisma.vehicle.findMany({
      take: DEFAULT_TAKE,
      where: {
        id: { in: autocompleteDto.ids },
      },
    });

    const secondResult = await this.prisma.vehicle.findMany({
      take: DEFAULT_TAKE,
      where: {
        registration_number: { contains: autocompleteDto.search || '' },
        id: { notIn: firstResult.map(({ id }) => id) },
      },
    });

    return [
      ...firstResult,
      ...secondResult,
    ]
      .sort((a, b) => (a.id > b.id ? 1 : -1))
      .map(({ id, registration_number }) => ({ id, label: registration_number }));
  }

  async findContacts(autocompleteDto: AutocompleteDto, email?: string): Promise<AutocompleteResponseDto[]> {
    return this.contactFind({
      autocompleteDto,
      prismaModel: this.prisma.contact,
      additionalWhereCondition: {
        ...(email && {
          OR: [
            { email },
            { company_contact_company_idTocompany: { company: { companyContacts: { some: { email } } } } },
          ],
        }),
      },
    });
  }

  async findPartners(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.company,
      additionalWhereCondition: { is_partner: true },
    });
  }

  async findCompanies(autocompleteDto: AutocompleteDto, email?: string): Promise<AutocompleteResponseDto[]> {
    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.company,
      selectProperties: ['kvk_nr'],
      additionalWhereCondition: {
        ...(email && {
          OR: [
            { companyContacts: { some: { email } } },
            { company: { companyContacts: { some: { email } } } },
          ],
        }),
      },
    });
  }

  private async commonFind({
    autocompleteDto,
    prismaModel,
    additionalWhereCondition = {},
    selectProperties = [],
    searchKey = 'name',
  }: {
    autocompleteDto: AutocompleteDto,
    prismaModel,
    additionalWhereCondition?: object,
    selectProperties?: string[],
    searchKey?: string
  }): Promise<AutocompleteResponseDto[]> {
    const firstResult = await prismaModel.findMany({
      take: DEFAULT_TAKE,
      where: { id: { in: autocompleteDto.ids }, ...additionalWhereCondition },
    });

    const secondResult = await prismaModel.findMany({
      take: DEFAULT_TAKE,
      where: {
        [searchKey]: { contains: autocompleteDto.search || '' },
        id: { notIn: firstResult.map(({ id }) => id) },
        ...additionalWhereCondition,
      },
    });

    const result = [
      ...firstResult,
      ...secondResult,
    ]
      .sort((a, b) => (a.id > b.id ? 1 : -1));

    return result.map(({ id, ...rest }) => {
      const obj = { id, label: rest[searchKey] };
      selectProperties.forEach((property: string) => {
        obj[property] = rest[property];
      });

      return obj;
    });
  }

  private async contactFind({
    autocompleteDto,
    prismaModel,
    additionalWhereCondition = {},
  }: {
    autocompleteDto: AutocompleteDto,
    prismaModel,
    additionalWhereCondition?: object,
  }): Promise<AutocompleteResponseDto[]> {
    const firstResult = await prismaModel.findMany({
      take: DEFAULT_TAKE,
      where: { id: { in: autocompleteDto.ids }, ...additionalWhereCondition },
      include: { company_contact_company_idTocompany: { select: { name: true } } },
    });

    const secondResult = await prismaModel.findMany({
      take: DEFAULT_TAKE,
      where: {
        OR: [
          { name: { contains: autocompleteDto.search || '' } },
          { company_contact_company_idTocompany: { name: { contains: autocompleteDto.search || '' } } },
        ],
        id: { notIn: firstResult.map(({ id }) => id) },
        ...additionalWhereCondition,
      },
      include: { company_contact_company_idTocompany: { select: { name: true } } },
    });

    const result = [
      ...firstResult,
      ...secondResult,
    ]
      .sort((a, b) => (a.id > b.id ? 1 : -1));

    return result.map(({ id, name, company_contact_company_idTocompany }) => ({ id, label: `${name} - ${company_contact_company_idTocompany.name}` }));
  }

  async findTeams(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.team,
    });
  }

  async findUsers(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind({
      autocompleteDto,
      prismaModel: this.prisma.user,
      searchKey: 'username',
    });
  }
}
