import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyRepository } from './company.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ContactRepository } from '../contact/contact.repository';

@Module({
  providers: [
    CompanyService,
    {
      provide: 'TYPE',
      useValue: undefined,
    },
    CompanyRepository,
    ContactRepository,
  ],
  controllers: [CompanyController],
  imports: [PrismaModule],
})
export class CompanyModule {}
