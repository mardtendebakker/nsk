import { Module } from '@nestjs/common';
import { LocationLabelService } from './location-label.service';
import { LocationLabelRepository } from './location-label.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationTemplateModule } from '../admin/location-template/location-template.module';

@Module({
  providers: [LocationLabelService, LocationLabelRepository],
  imports: [PrismaModule, LocationTemplateModule],
  exports: [LocationLabelService],
})
export class LocationLabelModule {}
