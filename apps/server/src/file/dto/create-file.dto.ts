import { OmitType } from '@nestjs/swagger';
import { PrismaCreateFileDto } from './prisma-create-file.dto';

export class CreateFileDto extends OmitType(PrismaCreateFileDto, [
  'original_client_filename',
  'unique_server_filename',
] as const) {}
