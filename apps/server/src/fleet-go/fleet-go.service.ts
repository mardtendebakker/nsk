import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { EquipmentResponseDto } from './dto/equipment-response-dto';
import { ModuleService } from '../module/module.service';

@Injectable()
export class FleetGoService {
  private token?: string;

  private axios: AxiosInstance;

  private refreshRequested: boolean = false;

  private subscribers: Array<(token: string) => void> = [];

  private loginUri = 'Session/Login';

  constructor(private moduleService: ModuleService) {
    this.axios = axios.create({ baseURL: 'https://api.fleetgo.com/api/' });
    this.axios.interceptors.request.use(this.tokenInterceptor.bind(this), (err) => Promise.reject(err));
    this.axios.interceptors.response.use((response) => response, this.refreshTokenInterceptor.bind(this));
  }

  async getEquipments(): Promise<EquipmentResponseDto[]> {
    const result = await this.axios.get('Equipment/GetEquipments?groupId=3378022238&hasDeviceOnly=true');

    return result.data;
  }

  private async getToken(): Promise<string> {
    const config = await this.moduleService.getTrackingConfig();

    const response = await this.axios.post(this.loginUri, {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      username: config.username,
      password: config.password,
      user_token_type: 1,
    });

    return response.data.access_token;
  }

  private async tokenInterceptor(config) {
    if (!this.token && config.url != this.loginUri) {
      this.token = await this.getToken();
    }

    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${this.token}`;
    return config;
  }

  private async refreshTokenInterceptor(err: AxiosError) {
    const { config, response } = err;

    if (response.status === 401 && config.url != this.loginUri) {
      const returnPromise = new Promise((resolve) => {
        this.subscribers.push((token) => {
          config.headers.Authorization = `Bearer ${token}`;
          resolve(this.axios(config));
        });
      });

      if (!this.refreshRequested) {
        this.refreshRequested = true;
        this.token = await this.getToken();

        try {
          this.subscribers.map((cb) => cb(this.token));
          this.subscribers = [];
          this.refreshRequested = false;
        } catch {
          return Promise.reject(err);
        }
      }

      return returnPromise;
    }

    return Promise.reject(err);
  }
}
