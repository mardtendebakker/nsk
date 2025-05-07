import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleRepository } from './vehicle.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { VehicleController } from './vehicle.controller';

@Module({
  providers: [VehicleService, VehicleRepository],
  exports: [VehicleService],
  controllers: [VehicleController],
  imports: [PrismaModule],
})
export class VehicleAdminModule {}
