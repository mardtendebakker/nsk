import { Module } from '@nestjs/common';
import { PurcahseService } from './purcahse.service';
import { PurcahseController } from './purcahse.controller';
import { PurcahseRepository } from './purcahse.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [PurcahseService, PurcahseRepository],
  controllers: [PurcahseController],
  imports: [PrismaModule]
})
export class PurcahseModule {}
