import 'multer';
import { Injectable } from '@nestjs/common';
import { FileRepository } from './file.repository';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Prisma, afile } from '@prisma/client';
import { CreateFileDto } from './dto/upload-meta.dto';
import { FileS3 } from './file.s3';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly repository: FileRepository,
    private readonly fileS3: FileS3
  ) {}

  async get(id: number) {
    const where: Prisma.afileWhereUniqueInput = { id };
    const file = await this.repository.findOne({ where });

    const fileKey = `${file.discr}/${file.original_client_filename}`;
    const response = await this.fileS3.get(fileKey);

    return response.Body.transformToByteArray();
  }

  async create(
    createFileDto: CreateFileDto,
    file: string | Uint8Array | Buffer
  ): Promise<afile> {
    const fileName = uuidv4();
    const fileKey = `${createFileDto.discr}/${fileName}`;

    await this.fileS3.put(fileKey, file);

    try {
      return this.repository.create({
        ...createFileDto,
        original_client_filename: fileName,
        unique_server_filename:
          this.configService.get<string>('S3_FILE_BUCKET'),
      });
    } catch (e) {
      this.fileS3.delete(fileKey);
      throw e;
    }
  }

  async delete(id: number) {
    const where: Prisma.afileWhereUniqueInput = { id };
    const file = await this.repository.findOne({ where });

    const fileKey = `${file.discr}/${file.original_client_filename}`;
    this.fileS3.delete(fileKey);

    return this.repository.delete(where);
  }

  async deleteMany(ids: number[]) {
    const where: Prisma.afileWhereInput = {
      id: {
        in: ids,
      },
    };

    const files = await this.repository.getAll(where);
    const fileKeys = files.map(
      (file) => `${file.discr}/${file.original_client_filename}`
    );
    this.fileS3.deleteMany(fileKeys);

    return this.repository.deleteMany(where);
  }
}
