import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { FileS3 } from './file.s3';

@Global()
@Module({
  providers: [FileService, FileRepository, FileS3],
  imports: [PrismaModule],
  exports: [FileService],
})
export class FileModule {}
