import { Authentication } from "@nestjs-cognito/auth";
import { Body, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { FindCompanyQueryDto } from "./dto/find-company-query.dto";
import { FindCompaniesResponeDto } from "./dto/find-company-response.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { CompanyEntity } from "./entities/company.entity";

@ApiBearerAuth()
@Authentication()
export class CompanyController {
  constructor(protected readonly companyService: CompanyService) {}
  @Get('')
  @ApiResponse({isArray: true, type: FindCompaniesResponeDto})
  findAll(@Query() query: FindCompanyQueryDto) {
    return this.companyService.findAll(query);
  }

  @Post('')
  @ApiResponse({type: CompanyEntity})
  create(@Body() body: CreateCompanyDto) {
    return this.companyService.create(body);
  }

  @Get(':id')
  @ApiResponse({type: CompanyEntity})
  findOne(@Param('id') id: number) {
    return this.companyService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({type: CompanyEntity})
  update(@Param('id') id: number, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }
}
