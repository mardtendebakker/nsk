import { Module } from '@nestjs/common';
import { PickupService } from './pickup.service';
import { PickupRepository } from './pickup.repository';
import { PickupController } from './pickup.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  providers: [PickupService, PickupRepository],
  exports: [PickupService],
  controllers: [PickupController],
  imports: [PrismaModule],
})
export class PickupModule {}
