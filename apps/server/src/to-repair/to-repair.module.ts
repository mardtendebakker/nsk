import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationModule } from '../admin/location/location.module';
import { ToRepairRepository } from './to-repair.repository';
import { ToRepairService } from './to-repair.service';
import { ToRepairController } from './to-repair.controller';
import { FileModule } from '../file/file.module';
import { PrintService } from '../print/print.service';
import { EntityStatus } from '../common/types/entity-status.enum';
import { LocationLabelModule } from '../location-label/location-label.module';
import { BlanccoModule } from '../blancco/blancco.module';
import { ToRepairBlancco } from './to-repair.blancco';

@Module({
  providers: [
    ToRepairService,
    ToRepairRepository,
    {
      provide: 'IS_REPAIR',
      useValue: true,
    },
    {
      provide: 'ENTITY_STATUS',
      useValue: EntityStatus.Active,
    },
    PrintService,
    ToRepairBlancco,
  ],
  controllers: [ToRepairController],
  imports: [
    PrismaModule,
    LocationModule,
    LocationLabelModule,
    FileModule,
    BlanccoModule,
  ],
  exports: [ToRepairService],
})
export class ToRepairModule {}
