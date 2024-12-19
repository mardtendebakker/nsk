import {
  Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { FindCompaniesResponseDto } from './dto/find-company-response.dto';
import { FindManyDto } from './dto/find-many.dto';
import { CompanyEntity } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { requiredModule } from '../common/guard/required-modules.guard';
import { ALL_MAIN_GROUPS, LOCAL_GROUPS, PARTNERS_GROUPS } from '../user/model/group.enum';
import { ConnectedUser, ConnectedUserType } from '../security/decorator/connected-user.decorator';
import { Authorization } from '../security/decorator/authorization.decorator';

@ApiBearerAuth()
@Authorization(ALL_MAIN_GROUPS)
@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(protected readonly companyService: CompanyService) {}

  @Get('')
  @ApiResponse({ type: FindCompaniesResponseDto })
  findAll(
  @Query() query: FindManyDto,
    @ConnectedUser()
    {
      groups,
      email,
    }: ConnectedUserType,
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.companyService.findAll(query);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.companyService.findAll(query, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Get(':id')
  @ApiResponse({ type: CompanyEntity })
  @UseGuards(requiredModule('customer_contact_action'))
  findOne(
  @Param('id') id: number,
    @ConnectedUser()
    {
      groups,
      email,
    }: ConnectedUserType,
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.companyService.findOne(id);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.companyService.findOne(id, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Post('')
  @ApiResponse({ type: CompanyEntity })
  @UseGuards(requiredModule('customer_contact_action'))
  create(
  @Body() body: CreateCompanyDto,
    @ConnectedUser()
    {
      groups,
      email,
    }: ConnectedUserType,
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.companyService.create(body);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.companyService.create(body, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Put(':id')
  @ApiResponse({ type: CompanyEntity })
  @UseGuards(requiredModule('customer_contact_action'))
  update(
  @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @ConnectedUser()
    {
      groups,
      email,
    }: ConnectedUserType,
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.companyService.update(id, updateCompanyDto);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.companyService.update(id, updateCompanyDto, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Delete(':id')
  @UseGuards(requiredModule('customer_contact_action'))
  delete(
  @Param('id') id: number,
    @ConnectedUser()
    {
      groups,
      email,
    }: ConnectedUserType,
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.companyService.delete(id);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.companyService.delete(id, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }
}
