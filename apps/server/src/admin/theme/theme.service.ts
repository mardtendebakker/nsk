import { Injectable } from '@nestjs/common';
import { afile } from '@prisma/client';
import { FindThemeResponseDto } from './dto/find-theme-response.dto';
import { ThemeRepository } from './theme.repository';
import { FileService } from '../../file/file.service';
import { FileDiscrimination } from '../../file/types/file-discrimination.enum';

const afileFormat = (file: afile) => ({
  id: file.id,
  unique_server_filename: file.unique_server_filename,
  original_client_filename: file.original_client_filename,
  discr: file.discr,
});

@Injectable()
export class ThemeService {
  constructor(
    private themeRepository: ThemeRepository,
    private fileService: FileService,
  ) {}

  async getTheme(): Promise<FindThemeResponseDto | null> {
    const result = await this.themeRepository.findOne();

    return result ? {
      companyName: result.company_name,
      dashboardMessage: result.dashboard_message,
      logo: afileFormat(result.logo),
      favicon: afileFormat(result.favicon),
      palette: JSON.parse(result.palette),
    } : null;
  }

  async updateOrCreate({
    companyName, dashboardMessage, palette, logo, favicon,
  }: { companyName: string, dashboardMessage?: string, palette: string, logo?: Express.Multer.File, favicon?: Express.Multer.File }): Promise<FindThemeResponseDto> {
    const result = await this.themeRepository.findOne();

    let newLogo: afile | undefined;
    let newFavicon: afile | undefined;

    const originalLogo = result?.logo;
    const originalFavicon = result?.favicon;

    if (logo) {
      newLogo = await this.fileService.create({
        discr: FileDiscrimination.THEME_IMAGE_FILE,
      }, {
        Body: logo.buffer,
        ContentType: logo.mimetype,
      });
    }

    if (favicon) {
      newFavicon = await this.fileService.create({
        discr: FileDiscrimination.THEME_IMAGE_FILE,
      }, {
        Body: favicon.buffer,
        ContentType: favicon.mimetype,
      });
    }

    const data = {
      company_name: companyName,
      dashboard_message: dashboardMessage,
      logo: newLogo ? {
        connect: newLogo,
      } : undefined,
      favicon: newFavicon ? {
        connect: newFavicon,
      } : undefined,
      palette,
    };

    const theme = result ? await this.themeRepository.update({
      data,
      where: {
        id: result.id,
      },
    }) : await this.themeRepository.create({ data });

    if (newLogo && originalLogo) {
      await this.fileService.delete(originalLogo.id);
    }
    if (newFavicon && originalFavicon) {
      await this.fileService.delete(originalFavicon.id);
    }

    return {
      dashboardMessage: theme.dashboard_message,
      companyName: theme.company_name,
      logo: afileFormat(theme.logo),
      favicon: afileFormat(theme.favicon),
      palette: JSON.parse(theme.palette),
    };
  }
}
