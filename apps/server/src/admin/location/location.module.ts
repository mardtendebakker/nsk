import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationRepository } from './location.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { LocationController } from './location.controller';

@Module({
  providers: [LocationService, LocationRepository],
  exports: [LocationService],
  controllers: [LocationController],
  imports: [PrismaModule],
})
export class LocationModule {}
