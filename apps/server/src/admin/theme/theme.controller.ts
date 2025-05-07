import {
  Body, Controller, Get, NotFoundException, Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags,
} from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ThemeService } from './theme.service';
import { FindThemeResponseDto } from './dto/find-theme-response.dto';
import { MANAGER_GROUPS } from '../../user/model/group.enum';
import { Authorization } from '../../security/decorator/authorization.decorator';

@ApiTags('admin-theme')
@Controller('admin/theme')
@ApiBearerAuth()
export class ThemeController {
  constructor(protected readonly themeService: ThemeService) {}

  @Get('')
  @ApiResponse({ type: FindThemeResponseDto })
  @Authorization()
  async get() {
    const theme = await this.themeService.getTheme();

    if (theme) {
      return theme;
    }

    throw new NotFoundException();
  }

  @Put('')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        palette: { type: 'object', nullable: false },
        companyName: { type: 'string', nullable: false },
        dashboardMessage: { type: 'string' },
        logo: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
        favicon: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
      },
    },
  })
  @Authorization(MANAGER_GROUPS)
  @UseInterceptors(AnyFilesInterceptor())
  @ApiResponse({ type: FindThemeResponseDto })
  createOrUpdate(@Body() body, @UploadedFiles() files?: Express.Multer.File[]) {
    let logo;
    let favicon;

    files.forEach((file) => {
      if (file.fieldname == 'logo') {
        logo = file;
      }
      if (file.fieldname == 'favicon') {
        favicon = file;
      }
    });

    return this.themeService.updateOrCreate({
      ...body,
      logo,
      favicon,
    });
  }
}
