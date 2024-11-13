import { HttpService } from '@nestjs/axios';
import {
  BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException,
} from '@nestjs/common';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { catchError, lastValueFrom } from 'rxjs';
import * as AdmZip from 'adm-zip';
import { PurchaseService } from '../purchase/purchase.service';
import { BlanccoV1 } from './types/blancco-v1';
import { BlanccoRepository } from './blancco.repository';
import { BlanccoFormat } from './types/blancco-format.enum';
import { BlanccoResponse } from './types/blancco-response';
import { BlanccoReportsV1 } from './types/blancco-reports-v1';
import * as DefaultAttribute from './data/default-attributes.json';
import { BlanccoProductTypes } from './types/blancco-product-types.enum';
import { ModuleService } from '../module/module.service';

@Injectable()
export class BlanccoService {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly httpService: HttpService,
    private readonly moduleService: ModuleService,
    private readonly repository: BlanccoRepository,
  ) {}

  async init() {
    const result: boolean[] = [];

    const productTypeNames = Object.values(BlanccoProductTypes);
    for (let i = 0; i < productTypeNames.length; i++) {
      const productTypeName = productTypeNames[i];
      const productType = await this.repository.findOrCreateProductType({
        name: productTypeName,
        pindex: 1 + i,
        is_public: false,
      });

      const attributesData = DefaultAttribute?.[productTypeName] || DefaultAttribute.Default;

      const attributeIds: number[] = [];
      for (const attributeData of attributesData) {
        const attribute = await this.repository.findOrCreateAttribute(attributeData);
        attributeIds.push(attribute.id);
        result.push(true);
      }

      for (const attributeId of attributeIds) {
        await this.repository.findOrCreateProductTypeAttribute({
          attribute_id: attributeId,
          product_type_id: productType.id,
        });
      }
    }

    return `${result.filter((res) => res === true).length} blancco attribute has been created!`;
  }

  async getReports(orderId: number, newCursor?: string): Promise<BlanccoV1> {
    const purchaseOrder = await this.purchaseService.findOne(orderId);
    if (!purchaseOrder || !purchaseOrder.order_nr) {
      throw new NotFoundException('Purchase order not found!');
    }

    const { zip, cursor } = await this.downloadReports(purchaseOrder.order_nr, newCursor);

    const reports = this.convertToObject(zip);

    return {
      cursor,
      ...reports,
    };
  }

  getValueFromReportByKey(
    report: unknown,
    key: string,
  ): string {
    return <string> this.getValueFromReportByFlattenedKey(report, key);
  }

  formatNumberWithScale(input: unknown): string {
    let num = Number(input);
    if (Number.isNaN(num)) {
      return String(input);
    }

    const unitSuffixes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    let unitIndex = 0;

    while (num >= 1000 && unitIndex < unitSuffixes.length - 1) {
      num /= 1000;
      unitIndex++;
    }

    const roundedNum = Math.floor(num);
    const unit = unitSuffixes?.[unitIndex] ?? '';

    return `${roundedNum}${unit}`;
  }

  private getValueFromReportByFlattenedKey(report: unknown, key: string) {
    const keys = key.split('.');
    let value: unknown = report;
    for (let i = 0; i < keys.length; i++) {
      let k = keys[i];
      if (k === '0') {
        k = keys[++i];
        if (Array.isArray(value)) {
          if (keys?.[i - 3] === '1') {
            const rKey = new RegExp(`^${k}`);
            let val = '';
            value.forEach((item) => {
              for (const [key1, value1] of Object.entries(item)) {
                if (rKey.test(key1)) {
                  val += `${value1}, `;
                }
              }
            });
            value = val.slice(0, -2);
          } else {
            value = value.find((v) => k in v)?.[k];
          }
        } else {
          value = value?.[k];
        }
      } else if (k === '1') {
        k = keys[i + 1];
        if (Array.isArray(value)) {
          value = value
            .filter((v) => k in v)
            .reduce(
              (result, item, index) => {
                for (let j = 0; j < item[k].length; j++) {
                  const obj = item[k][j];
                  const newObj: unknown = {};
                  // eslint-disable-next-line guard-for-in
                  for (const key1 in obj) {
                    newObj[`${key1}${index + 1}`] = obj[key1];
                  }
                  result[k].push(newObj);
                }
                return result;
              },
              { [k]: [] },
            );
        } else {
          value = value?.[k];
        }
      } else {
        value = value?.[k];
      }
      if (value === undefined) break;
    }
    return value;
  }

  private async downloadReports(search: string, cursor?: string): Promise<BlanccoResponse> {
    const config = await this.moduleService.getBlanccoConfig();

    const requestConfig: AxiosRequestConfig = {
      headers: {
        'X-BLANCCO-API-KEY': config.apiKey,
      },
      responseType: 'arraybuffer',
    };
    const body = {
      filter: {
        date: {
          gte: '2023-12-19T00:00:00Z',
        },
        fields: [
          {
            like: search,
            name: '@custom-Order Number',
          },
        ],
      },
      format: BlanccoFormat.JSON,
      cursor,
    };
    const response = await lastValueFrom(
      this.httpService.post(`${config.apiUrl}report/export`, body, requestConfig).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      ),
    );

    return this.handleResponse(response);
  }

  private handleResponse(response: AxiosResponse): BlanccoResponse {
    if (response?.status === 200) {
      return {
        zip: response.data,
        cursor: response.headers['x-blancco-cursor'],
      };
    } if (response?.status === 204) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        message: `No Blancco report were found, Blancco message: ${response.statusText}`,
      }, HttpStatus.NOT_FOUND);
    } else {
      throw new BadRequestException(
        `Blancco status: ${response.status}, message: ${response.statusText}`,
      );
    }
  }

  private convertToObject(rawZip: string): BlanccoReportsV1 {
    // Extract zip contents in memory
    const zip = new AdmZip(rawZip);
    const zipEntries = zip.getEntries();

    const resultObject: BlanccoReportsV1 = {};

    zipEntries.forEach((entry) => {
      if (!entry.isDirectory && entry.name.endsWith('.json')) {
        const jsonContent = zip.readAsText(entry);

        try {
          const jsonObject = JSON.parse(jsonContent);
          const fileName = entry.name.replace('.json', '');
          resultObject[fileName] = jsonObject;
        } catch (error) {
          console.error(
            `Error parsing JSON file ${entry.name}: ${error.message}`,
          );
        }
      }
    });

    return resultObject;
  }
}
