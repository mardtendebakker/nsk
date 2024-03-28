import { Module } from '@nestjs/common';
import { LocationTemplateController } from './location-template.controller';
import { LocationTemplateService } from './location-template.service';
import { LocationTemplateRepository } from './location-template.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  providers: [LocationTemplateService, LocationTemplateRepository],
  controllers: [LocationTemplateController],
  imports: [PrismaModule],
  exports: [LocationTemplateService],
})
export class LocationTemplateModule {}
