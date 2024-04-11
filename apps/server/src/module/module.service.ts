import { Injectable } from '@nestjs/common';
import { module } from '@prisma/client';
import { FindModuleResponseDto } from './dto/find-module-response.dto';
import { ModulePaymentService } from '../module-payment/module-payment.service';
import { ModuleRepository } from './module.repository';
import { ModuleName } from './moduleName.type';

export interface Module {
  id: number;
  name: ModuleName;
  price: number;
}

interface TrackingConfig {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
}

interface BlanccoConfig {
  apiUrl: string;
  apiKey: string;
}

@Injectable()
export class ModuleService {
  constructor(
    private modulePaymentService: ModulePaymentService,
    private repository: ModuleRepository,
  ) {}

  async findAll(): Promise<FindModuleResponseDto[]> {
    const result: FindModuleResponseDto[] = [];
    const dateNow = new Date();
    const modules = await this.repository.findAll();

    for (const m of modules.data) {
      const payment = await this.modulePaymentService.findLastValidModulePaymentByModule(m.name);

      result.push({
        id: m.id,
        name: m.name as ModuleName,
        price: m.price,
        activeAt: payment?.activeAt || null,
        expiresAt: payment?.expiresAt || null,
        active: dateNow > payment?.activeAt && dateNow < payment?.expiresAt,
        freeTrialUsed: !!payment,
        config: this.buildConfig(m),
      });
    }

    return result;
  }

  async setConfig(id: number, config: object) {
    await this.repository.update({
      where: { id },
      data: { config: JSON.stringify(config) },
    });
  }

  async getTrackingConfig(): Promise<TrackingConfig> {
    const result = await this.repository.findOne({ where: { name: 'tracking' } });

    return JSON.parse(result.config);
  }

  async getBlanccoConfig(): Promise<BlanccoConfig> {
    const result = await this.repository.findOne({ where: { name: 'blancco' } });

    return JSON.parse(result.config);
  }

  buildConfig(param: module) {
    const config = param.config ? JSON.parse(param.config) : {};

    switch (param.name as ModuleName) {
      case 'blancco':
        return {
          apiUrl: {
            value: config.apiUrl || null,
            required: true,
          },
          apiKey: {
            value: config.apiKey || null,
            sensitive: true,
            required: true,
          },
        };
      case 'tracking':
        return {
          clientId: {
            value: config.clientId || null,
            sensitive: true,
            required: true,
          },
          clientSecret: {
            value: config.clientSecret || null,
            sensitive: true,
            required: true,
          },
          username: {
            value: config.username || null,
            sensitive: true,
            required: true,
          },
          password: {
            value: config.password || null,
            sensitive: true,
            required: true,
          },
        };
      default:
        return undefined;
    }
  }
}
