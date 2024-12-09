import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';
import { ThemeRepository } from './theme.repository';
import { FileS3 } from '../../file/file.s3';

@Module({
  providers: [ThemeService, ThemeRepository, FileS3],
  controllers: [ThemeController],
  imports: [PrismaModule],
})
export class ThemeModule {}
