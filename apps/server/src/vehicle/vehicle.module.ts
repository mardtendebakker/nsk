import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { FleetGoModule } from '../fleet-go/fleet-go.module';
import { FleetGoService } from '../fleet-go/fleet-go.service';

@Module({
  providers: [VehicleService, FleetGoService],
  controllers: [VehicleController],
  imports: [PrismaModule, FleetGoModule]
})
export class VehicleModule { }
