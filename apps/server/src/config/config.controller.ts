import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { FindConfigResponseDto } from './dto/find-config-response.dto';

@ApiBearerAuth()
@ApiTags('configs')
@Controller('configs')
export class ConfigController {
  constructor(protected readonly configService: ConfigService) {}

  @Get('')
  @ApiResponse({ type: FindConfigResponseDto })
  get() {
    return this.configService.getConfigs();
  }
}
