import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';

@Module({
  providers: [FileService, FileRepository],
  imports: [PrismaModule]
})
export class FileModule {}
