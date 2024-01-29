import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, lastValueFrom } from 'rxjs';
import * as AdmZip from 'adm-zip';
import { PurchaseService } from '../purchase/purchase.service';

type Reports = Record<string, unknown>;

@Injectable()
export class BlanccoService {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getList(orderId: number) {
    const purchaseOrder = await this.purchaseService.findOne(orderId);
    if (!purchaseOrder || !purchaseOrder.order_nr) {
      throw new NotFoundException('Purchase order not found!');
    }

    return this.getReports(purchaseOrder.order_nr);
  }

  private async getReports(search: string): Promise<Reports> {
    const rawReports = await this.downloadReports(search);
    const reports = await this.convertToObject(rawReports);

    return reports;
  }

  private async convertToObject(rawZip: string): Promise<Reports> {
    // Extract zip contents in memory
    const zip = new AdmZip(rawZip);
    const zipEntries = zip.getEntries();

    const resultObject: Reports = {};

    zipEntries.forEach((entry) => {
      if (!entry.isDirectory && entry.name.endsWith('.json')) {
        const jsonContent = zip.readAsText(entry);

        try {
          const jsonObject = JSON.parse(jsonContent);
          const fileName = entry.name.replace('.json', '');
          resultObject[fileName] = jsonObject;
        } catch (error) {
          console.error(`Error parsing JSON file ${entry.name}: ${error.message}`);
        }
      }
    });

    return resultObject;
  }

  private async downloadReports(search: string): Promise<string> {
    const url = this.configService.get<string>('BLANCCO_API_URL');

    const requestConfig: AxiosRequestConfig = {
      headers: {
        'X-BLANCCO-API-KEY': this.configService.get<string>('BLANCCO_API_KEY'),
      },
      responseType: 'arraybuffer',
    };
    const body = {
      filter: {
        fields: [
          {
            like: search,
            name: '@custom-Order Number',
          },
        ],
      },
      format: 'JSON',
    };
    const response = await lastValueFrom(
      this.httpService.post(`${url}report/export`, body, requestConfig).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      ),
    );

    if (response?.status === 200) {
      return response.data;
    } else if (response?.status === 204) {
      throw new NotFoundException(`Blancco status: ${response.status}, message: ${response.statusText}`);
    } else {
      throw new BadRequestException(`Blancco status: ${response.status}, message: ${response.statusText}`);
    }
  }
}
