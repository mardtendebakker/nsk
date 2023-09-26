import { Module } from '@nestjs/common';
import { ArchivedService } from './archived.service';
import { ArchivedRepository } from './archived.repository';
import { ArchivedController } from './archived.controller';
import { PrintService } from '../../print/print.service';
import { FileModule } from '../../file/file.module';
import { LocationModule } from '../../location/location.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { EntityStatus } from '../../common/types/entity-status.enum';

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
  imports: [PrismaModule, LocationModule, FileModule],
  exports: [ArchivedService],
})
export class ArchivedModule {}
