import { Module } from '@nestjs/common';
import { FleetGoService } from './fleet-go.service';

@Module({
  providers: [FleetGoService],
  exports: [FleetGoService]
})

export class FleetGoModule { }
