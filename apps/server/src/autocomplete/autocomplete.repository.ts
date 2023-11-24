import { Injectable } from '@nestjs/common';
import { AutocompleteDto } from './dto/autocomplete.dto';
import { AutocompleteResponseDto } from './dto/autocomplete-response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ContactDiscrimination } from '../contact/types/contact-discrimination.enum';
import { LogisticRole } from '../logistic/types/logistic-role.enum';
import { IsPartner } from '../contact/types/is-partner.enum';

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

  async findPurchaseStatuses(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(autocompleteDto, this.prisma.order_status, { is_purchase: true });
  }

  async findSalesStatuses(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(autocompleteDto, this.prisma.order_status, { is_sale: true });
  }

  async findRepairStatuses(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(autocompleteDto, this.prisma.order_status, { is_repair: true });
  }

  async findCustomers(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(
      autocompleteDto,
      this.prisma.contact,
      { discr: ContactDiscrimination.CUSTOMER },
      { key: 'company_contact_company_idTocompany', field: 'name' }
    );
  }

  async findSuppliers(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(
      autocompleteDto,
      this.prisma.contact,
      { discr: ContactDiscrimination.SUPLLIER },
      { key: 'company_contact_company_idTocompany', field: 'name' }
    );
  }

  async findLocations(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    const firstResult = await this.prisma.location.findMany({
      take: DEFAULT_TAKE,
      where: {id: {in: autocompleteDto.ids}},
      include: { location_template : { select: { id:true, template:true } }}
    });

    const secondResult = await this.prisma.location.findMany({
      take: DEFAULT_TAKE,
      where: {
        name: {contains: autocompleteDto.search || ''},
        id: {notIn: firstResult.map(({id}) => id)}
      },
      include: { location_template : { select: { id:true, template:true } }}
    })

    return [
      ...firstResult,
      ...secondResult
    ]
    .sort((a,b) => a.id > b.id ? 1 : -1)
    .map(({id, name, location_template}) => ({id, label: name, location_template}));
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

  async findContacts(autocompleteDto: AutocompleteDto, email?: string): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(
      autocompleteDto,
      this.prisma.contact,
      { ...(email && { contact: { email } }) },
      { key: 'company_contact_company_idTocompany', field: 'name' }
    );
  }

  async findPartners(autocompleteDto: AutocompleteDto): Promise<AutocompleteResponseDto[]> {
    return this.commonFind(
      autocompleteDto,
      this.prisma.contact,
      { is_partner: { gte: IsPartner.PARTNER } },
      { key: 'company_contact_company_idTocompany', field: 'name' }
    );
  }

  private async commonFind(
    autocompleteDto: AutocompleteDto,
    prismaModel,
    additionalWhereCondition = {},
    relation?: {
      key: string;
      field: string;
    }
  ): Promise<AutocompleteResponseDto[]> {
    const include = relation ? { [relation.key] : { select: { id:true, [relation.field]:true } }} : undefined;
    const firstResult = await prismaModel.findMany({
      take: DEFAULT_TAKE,
      where: {id: {in: autocompleteDto.ids}, ...additionalWhereCondition},
      include
    });

    const secondResult = await prismaModel.findMany({
      take: DEFAULT_TAKE,
      where: {
        OR: [
          { [relation?.field || 'name']: {contains: autocompleteDto.search || ''} },
          { ...(relation && { [relation.key]: { [relation.field]: {contains: autocompleteDto.search || ''} } }) },
        ],
        id: {notIn: firstResult.map(({id}) => id)},
        ...additionalWhereCondition
      },
      include
    });

    const result = [
      ...firstResult,
      ...secondResult
    ]
    .sort((a,b) => a.id > b.id ? 1 : -1);

    if (relation) {
      return result.map(({id, name, [relation.key]: key}) => ({id, label: `${name} - ${key[relation.field]}`}));
    } else {
      return result.map(({id, name}) => ({id, label: name}));
    }
  }
}
