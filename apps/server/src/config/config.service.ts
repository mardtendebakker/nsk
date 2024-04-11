import { Injectable } from '@nestjs/common';
import { FindConfigResponseDto } from './dto/find-config-response.dto';
import { ModuleService } from '../module/module.service';

@Injectable()
export class ConfigService {
  constructor(
    private moduleService: ModuleService,
  ) {}

  async getConfigs(): Promise<FindConfigResponseDto> {
    const config = await this.moduleService.getLogisticsConfig();

    return {
      logistics: {
        apiKey: config.apiKey,
        maxHour: config.maxHour,
        minHour: config.minHour,
        days: config.days,
      },
    };
  }
}
