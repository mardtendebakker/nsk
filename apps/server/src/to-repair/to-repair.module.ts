import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationModule } from '../location/location.module';
import { ToRepairRepository } from './to-repair.repository';
import { ToRepairService } from './to-repair.service';
import { ToRepairController } from './to-repair.controller';
import { FileModule } from '../file/file.module';

@Module({
  providers: [
    ToRepairService,
    ToRepairRepository,
    {
      provide: 'IS_REPAIR',
      useValue: true,
    },
  ],
  controllers: [ToRepairController],
  imports: [PrismaModule, LocationModule, FileModule],
  exports: [ToRepairService],
})
export class ToRepairModule {}
