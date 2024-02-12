import { Module } from '@nestjs/common';
import { ArchivedService } from './archived.service';
import { ArchivedRepository } from './archived.repository';
import { ArchivedController } from './archived.controller';
import { PrintService } from '../../print/print.service';
import { FileModule } from '../../file/file.module';
import { LocationModule } from '../../admin/location/location.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { EntityStatus } from '../../common/types/entity-status.enum';
import { LocationLabelModule } from '../../location-label/location-label.module';
import { BlanccoModule } from '../../blancco/blancco.module';

@Module({
  providers: [
    ArchivedService,
    ArchivedRepository,
    {
      provide: 'ENTITY_STATUS',
      useValue: EntityStatus.Archived,
    },
    PrintService
  ],
  controllers: [ArchivedController],
  imports: [
    PrismaModule,
    LocationModule,
    LocationLabelModule,
    FileModule,
    BlanccoModule,
  ],
  exports: [ArchivedService],
})
export class ArchivedModule {}
