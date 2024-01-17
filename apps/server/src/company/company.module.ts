import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyRepository } from './company.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ContactRepository } from '../contact/contact.repository';

@Module({
  providers: [
    CompanyService,
    CompanyRepository,
    ContactRepository,
  ],
  controllers: [CompanyController],
  imports: [PrismaModule],
  exports: [CompanyService],
})
export class CompanyModule {}
