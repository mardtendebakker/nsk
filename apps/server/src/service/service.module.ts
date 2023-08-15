import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceRepository } from './service.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PrintService } from '../print/print.service';
import { FileModule } from '../file/file.module';

@Module({
  providers: [ServiceService, ServiceRepository, PrintService],
  controllers: [ServiceController],
  imports: [PrismaModule, FileModule],
  exports: [ServiceService]
})
export class ServiceModule {}