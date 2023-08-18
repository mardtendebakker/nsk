import { Module } from '@nestjs/common';
import { AProductService } from './aproduct.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationModule } from '../location/location.module';
import { FileModule } from '../file/file.module';
import { AProductRepository } from './aproduct.repository';

@Module({
  providers: [AProductService, AProductRepository],
  imports: [PrismaModule, LocationModule, FileModule],
  exports: [AProductService]
})
export class AProductModule {}
