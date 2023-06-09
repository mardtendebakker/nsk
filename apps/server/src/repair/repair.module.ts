import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationModule } from '../location/location.module';
import { RepairRepository } from './repair.repository';
import { RepairService } from './repair.service';
import { RepairController } from './repair.controller';
import { FileModule } from '../file/file.module';

@Module({
  providers: [RepairService, RepairRepository],
  controllers: [RepairController],
  imports: [PrismaModule, LocationModule, FileModule]
})
export class RepairModule {}
