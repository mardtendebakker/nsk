import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/upload-meta.dto';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: CreateFileDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.fileService.create(body, file.buffer);
  }

  @Delete('')
  deleteMany(@Body() ids: number[]) {
    return this.fileService.deleteMany(ids);
  }
}
