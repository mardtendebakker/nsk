import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CompanyDiscrimination } from '../company/types/company-discrimination.enum';

@Module({
  providers: [
    CustomerService,
    {
      provide: 'TYPE',
      useValue: CompanyDiscrimination.CUSTOMER,
    },
    CustomerRepository,
  ],
  controllers: [CustomerController],
  imports: [PrismaModule],
  exports: [CustomerService],
})
export class CustomerModule {}
