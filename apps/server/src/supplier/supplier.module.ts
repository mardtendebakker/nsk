import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { SupplierRepository } from './supplier.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ContactDiscrimination } from '../contact/types/contact-discrimination.enum';

@Module({
  providers: [
    SupplierService,
    {
      provide: 'TYPE',
      useValue: ContactDiscrimination.SUPLLIER,
    },
    SupplierRepository,
  ],
  controllers: [SupplierController],
  imports: [PrismaModule],
  exports: [SupplierService],
})
export class SupplierModule {}
