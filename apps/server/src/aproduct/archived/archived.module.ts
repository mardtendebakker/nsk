import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ArchivedService } from './archived.service';
import { ArchivedRepository } from './archived.repository';
import { ArchivedController } from './archived.controller';
import { FileModule } from '../../file/file.module';
import { LocationModule } from '../../admin/location/location.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { EntityStatus } from '../../common/types/entity-status.enum';
import { LocationLabelModule } from '../../location-label/location-label.module';
import { BlanccoModule } from '../../blancco/blancco.module';
import { ArchivedBlancco } from './archived.blancco';
import { PrintModule } from '../../print/print.module';

@Module({
  providers: [
    ArchivedService,
    ArchivedRepository,
    {
      provide: 'ENTITY_STATUS',
      useValue: EntityStatus.Archived,
    },
    ArchivedBlancco,
  ],
  controllers: [ArchivedController],
  imports: [
    PrismaModule,
    LocationModule,
    LocationLabelModule,
    FileModule,
    BlanccoModule,
    PrintModule,
    HttpModule,
  ],
  exports: [ArchivedService],
})
export class ArchivedModule {}
