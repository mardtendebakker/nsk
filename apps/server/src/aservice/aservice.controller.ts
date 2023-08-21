import { Authentication } from "@nestjs-cognito/auth";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AServiceService } from "./aservice-service";
import { Body, Delete, Param, Post, Put } from "@nestjs/common";
import { UpdateServiceDto } from "./dto/update-aservice.dto";
import { CreateServiceDto } from "./dto/create-service.dto";

@ApiBearerAuth()
@Authentication()
export class AServiceController {
  constructor(protected readonly aServiceService: AServiceService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.aServiceService.create(createServiceDto);
  }
  
  @Put(':id')
  update(@Param('id') id: number, @Body() updateAServiceDto: UpdateServiceDto) {
    return this.aServiceService.update(id, updateAServiceDto);
  }
  
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.aServiceService.delete(id);
  }
}
