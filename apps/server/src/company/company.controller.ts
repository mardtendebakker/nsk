import { Authorization } from "@nestjs-cognito/auth";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CompanyService } from "./company.service";
import { FindCompaniesResponseDto } from "./dto/find-company-response.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { LOCAL_GROUPS } from "../common/types/cognito-groups.enum";
import { CompanyEntity } from "./entities/company.entity";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@ApiBearerAuth()
@Authorization(LOCAL_GROUPS)
@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(protected readonly companyService: CompanyService) {}
  @Get('')
  @ApiResponse({type: FindCompaniesResponseDto})
  findAll(@Query() query: FindManyDto) {
    return this.companyService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({type: CompanyEntity})
  findOne(@Param('id') id: number) {
    return this.companyService.findOne(id)
  }

  @Post('')
  @ApiResponse({type: CompanyEntity})
  create(@Body() body: CreateCompanyDto) {
    return this.companyService.create(body);
  }

  @Put(':id')
  @ApiResponse({type: CompanyEntity})
  update(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.companyService.delete(id);
  }
}
