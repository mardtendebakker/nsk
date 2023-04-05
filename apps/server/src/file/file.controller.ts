import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { Prisma } from '@prisma/client';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: Prisma.afileCreateInput,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileService.create(body, file);
  }
}
