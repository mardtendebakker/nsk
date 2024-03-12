import { Authorization, CognitoUser } from "@nestjs-cognito/auth";
import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CompanyService } from "./company.service";
import { FindCompaniesResponseDto } from "./dto/find-company-response.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { ALL_MAIN_GROUPS, CognitoGroups, LOCAL_GROUPS, PARTNERS_GROUPS } from "../common/types/cognito-groups.enum";
import { CompanyEntity } from "./entities/company.entity";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { requiredModule } from "../common/guard/required-modules.guard";

@ApiBearerAuth()
@Authorization(ALL_MAIN_GROUPS)
@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(protected readonly companyService: CompanyService) {}
  @Get('')
  @ApiResponse({type: FindCompaniesResponseDto})
  findAll(
    @Query() query: FindManyDto,
    @CognitoUser(["groups", "email"])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    }
  ) {
    if (groups.some(group=> LOCAL_GROUPS.includes(group))) {
      return this.companyService.findAll(query);
    } else if (groups.some(group=> PARTNERS_GROUPS.includes(group))) {
      return this.companyService.findAll(query, email);
    } else {
      throw new ForbiddenException("Insufficient permissions to access this api!");
    }
  }

  @Get(':id')
  @ApiResponse({type: CompanyEntity})
  @UseGuards(requiredModule('customer_contact_action'))
  findOne(
    @Param('id') id: number,
    @CognitoUser(["groups", "email"])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    }
  ) {
    if (groups.some(group=> LOCAL_GROUPS.includes(group))) {
      return this.companyService.findOne(id);
    } else if (groups.some(group=> PARTNERS_GROUPS.includes(group))) {
      return this.companyService.findOne(id, email);
    } else {
      throw new ForbiddenException("Insufficient permissions to access this api!");
    }
  }

  @Post('')
  @ApiResponse({type: CompanyEntity})
  @UseGuards(requiredModule('customer_contact_action'))
  create(
    @Body() body: CreateCompanyDto,
    @CognitoUser(["groups", "email"])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    }
  ) {
    if (groups.some(group=> LOCAL_GROUPS.includes(group))) {
      return this.companyService.create(body);
    } else if (groups.some(group=> PARTNERS_GROUPS.includes(group))) {
      return this.companyService.create(body, email);
    } else {
      throw new ForbiddenException("Insufficient permissions to access this api!");
    }
  }

  @Put(':id')
  @ApiResponse({type: CompanyEntity})
  @UseGuards(requiredModule('customer_contact_action'))
  update(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CognitoUser(["groups", "email"])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    },
  ) {
    if (groups.some(group=> LOCAL_GROUPS.includes(group))) {
      return this.companyService.update(id, updateCompanyDto);
    } else if (groups.some(group=> PARTNERS_GROUPS.includes(group))) {
      return this.companyService.update(id, updateCompanyDto, email);
    } else {
      throw new ForbiddenException("Insufficient permissions to access this api!");
    }
  }

  @Delete(':id')
  @UseGuards(requiredModule('customer_contact_action'))
  delete(
    @Param('id') id: number,
    @CognitoUser(["groups", "email"])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    }
  ) {
    if (groups.some(group=> LOCAL_GROUPS.includes(group))) {
      return this.companyService.delete(id);
    } else if (groups.some(group=> PARTNERS_GROUPS.includes(group))) {
      return this.companyService.delete(id, email);
    } else {
      throw new ForbiddenException("Insufficient permissions to access this api!");
    }
  }
}
