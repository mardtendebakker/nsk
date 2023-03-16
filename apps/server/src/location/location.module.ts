import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationRepository } from './location.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [LocationService, LocationRepository],
  exports: [LocationService],
  imports: [PrismaModule]
})
export class LocationModule {}
