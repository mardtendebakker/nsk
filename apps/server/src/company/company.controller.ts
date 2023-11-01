import { Authorization } from "@nestjs-cognito/auth";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CompanyService } from "./company.service";
import { FindCompaniesResponeDto } from "./dto/find-company-response.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { CompanyEntity } from "./entities/company.entity";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { INTERNAL_GROUPS } from "../common/types/cognito-groups.enum";

@ApiBearerAuth()
@Authorization(INTERNAL_GROUPS)
@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(protected readonly companyService: CompanyService) {}
  @Get('')
  @ApiResponse({type: FindCompaniesResponeDto})
  findAll(@Query() query: FindManyDto) {
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

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.companyService.delete(id);
  }
}
