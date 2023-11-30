import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [
    CustomerService,
    CustomerRepository,
  ],
  controllers: [CustomerController],
  imports: [PrismaModule],
  exports: [CustomerService],
})
export class CustomerModule {}
