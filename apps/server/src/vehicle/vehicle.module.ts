import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { FleetGoModule } from '../fleet-go/fleet-go.module';
import { FleetGoService } from '../fleet-go/fleet-go.service';
import { PickupModule } from '../calendar/pickup/pickup.module';
import { ModuleService } from '../module/module.service';
import { ModuleRepository } from '../module/module.repository';

@Module({
  providers: [VehicleService, FleetGoService, ModuleService, ModuleRepository],
  controllers: [VehicleController],
  imports: [PrismaModule, FleetGoModule, PickupModule],
})
export class VehicleModule { }
