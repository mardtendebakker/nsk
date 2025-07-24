import { Injectable } from '@nestjs/common';
import { module } from '@prisma/client';
import { FindModuleResponseDto, Type } from './dto/find-module-response.dto';
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

interface OrderStatusConfig {
  fromEmailAddress?: string;
}

interface BlanccoConfig {
  apiUrl: string;
  apiKey: string;
}

interface LogisticsConfig {
  apiKey: string;
  maxHour: number;
  minHour: number;
  days: string[];
}

@Injectable()
export class ModuleService {
  constructor(
    private modulePaymentService: ModulePaymentService,
    private repository: ModuleRepository,
  ) {}

  async findAll(): Promise<FindModuleResponseDto[]> {
    const result: FindModuleResponseDto[] = [];
    const modules = await this.repository.findAll();

    for (const m of modules.data) {
      const payment = await this.modulePaymentService.findLastValidModulePaymentByModule(m.name);

      result.push({
        id: m.id,
        name: m.name as ModuleName,
        price: m.price,
        activeAt: payment?.activeAt,
        expiresAt: payment?.expiresAt,
        active: payment?.active || false,
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

  async getOrderStatusConfig(): Promise<OrderStatusConfig> {
    const result = await this.repository.findOne({ where: { name: 'order_status' } });

    return JSON.parse(result.config);
  }

  async getBlanccoConfig(): Promise<BlanccoConfig> {
    const result = await this.repository.findOne({ where: { name: 'blancco' } });

    return JSON.parse(result.config);
  }

  async getLogisticsConfig(): Promise<LogisticsConfig> {
    const result = await this.repository.findOne({ where: { name: 'logistics' } });

    return JSON.parse(result.config);
  }

  buildConfig(param: module) {
    const config = param.config ? JSON.parse(param.config) : {};

    switch (param.name as ModuleName) {
      case 'blancco':
        return {
          apiUrl: {
            value: config.apiUrl,
            required: true,
            type: 'string' as Type,
          },
          apiKey: {
            value: config.apiKey,
            required: true,
            type: 'password' as Type,
          },
        };
      case 'tracking':
        return {
          clientId: {
            value: config.clientId,
            required: true,
            type: 'password' as Type,
          },
          clientSecret: {
            value: config.clientSecret,
            required: true,
            type: 'password' as Type,
          },
          username: {
            value: config.username,
            required: true,
            type: 'password' as Type,
          },
          password: {
            value: config.password,
            required: true,
            type: 'password' as Type,
          },
        };
      case 'logistics':
        return {
          apiKey: {
            value: config.apiKey,
            required: true,
            type: 'password' as Type,
          },
          minHour: {
            value: config.minHour,
            required: true,
            type: 'hour' as Type,
          },
          maxHour: {
            value: config.maxHour,
            required: true,
            type: 'hour' as Type,
          },
          days: {
            value: config.days,
            required: true,
            type: 'multiSelect' as Type,
            options: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          },
        };
      case 'order_statuses':
        return {
          fromEmailAddress: {
            value: config.fromEmailAddress,
            type: 'string' as Type,
          },
        };
      default:
        return undefined;
    }
  }
}
