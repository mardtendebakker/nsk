import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { SupplierRepository } from './supplier.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [SupplierService, SupplierRepository],
  controllers: [SupplierController],
  imports: [PrismaModule]
})
export class SupplierModule {}
