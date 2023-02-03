import { Body, Get, Post, Query } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { FindCompanyQueryDto } from "./dto/find-company-query.dto";
import { FindCompaniesResponeDto } from "./dto/find-company-response.dto";
import { CompanyEntity } from "./entities/company.entity";

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
}
