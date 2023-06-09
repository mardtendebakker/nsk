import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyRepository } from './company.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [CompanyService, CompanyRepository],
  controllers: [CompanyController],
  imports: [PrismaModule]
})
export class CompanyModule {}
