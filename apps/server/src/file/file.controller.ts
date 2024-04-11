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
import { CreateFileDto } from './dto/create-file.dto';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
  @Body() body: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileService.create(body, {
      Body: file.stream,
      ContentType: file.mimetype,
    });
  }

  @Delete('')
  deleteMany(@Body() ids: number[]) {
    return this.fileService.deleteMany(ids);
  }
}
