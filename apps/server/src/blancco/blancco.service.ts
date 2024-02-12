import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { catchError, lastValueFrom } from 'rxjs';
import * as AdmZip from 'adm-zip';
import { PurchaseService } from '../purchase/purchase.service';
import { BlanccoReportsV1, BlanccoHardwareReport } from './types/blancco-report-v1';
import { BlanccoRepository } from './blancco.repository';
import { BlanccoDefaultProductType } from './types/blancco-defualt-product-type.enum';
import { Prisma } from '@prisma/client';
import { BlanccoFormat } from './types/blancco-format.enum';

@Injectable()
export class BlanccoService {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly repository: BlanccoRepository
  ) {}

  async getReports(orderId: number): Promise<BlanccoReportsV1> {
    const purchaseOrder = await this.purchaseService.findOne(orderId);
    if (!purchaseOrder || !purchaseOrder.order_nr) {
      throw new NotFoundException('Purchase order not found!');
    }

    const rawReports = await this.downloadReports(purchaseOrder.order_nr);

    return this.convertToObject(rawReports);
  }

  async getProductType(report, productTypeName?: string) {
    let productType = await this.repository.findFirst({
      where: {
        name: productTypeName || BlanccoDefaultProductType.NAME,
      },
    });

    if (productType) {
      return productType;
    } else {
      let productTypeAttributeCreate: Prisma.product_type_attributeCreateWithoutProduct_typeInput[];
      for (const attrName in report) {
        productTypeAttributeCreate.push({
          attribute: {
            connectOrCreate: {
              where: {
                name: attrName,
              },
              create: {
                attr_code: attrName.replace(' ', '_'),
                name: attrName,
              },
            },
          },
        });
      }
      productType = await this.repository.cteateDefaultProductType({
        data: {
          name: BlanccoDefaultProductType.NAME,
          product_type_attribute: {
            create: productTypeAttributeCreate,
          },
        },
      });
    }

    return productType;
  }

  getValueFromReportByKey(
    report: BlanccoHardwareReport,
    key: string
  ): unknown | undefined {
    return this.getValueFromReportByFlattenedKey(report, key);
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
              for (const [key, value] of Object.entries(item)) {
                if (rKey.test(key)) {
                  val += `${value}, `;
                }
              }
            });
            value = val.slice(0, -2);
          } else {
            value = value.find(v => k in v)?.[k];
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
                  for (const key in obj) {
                    newObj[`${key}${index + 1}`] = obj[key];
                  }
                  result[k].push(newObj);
                }
                return result;
              },
              { [k]: [] }
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
        })
      )
    );

    return this.handleResponse(response);
  }

  private handleResponse(response: AxiosResponse) {
    if (response?.status === 200) {
      return response.data;
    } else if (response?.status === 204) {
      throw new NotFoundException(
        `Blancco status: ${response.status}, message: ${response.statusText}`
      );
    } else {
      throw new BadRequestException(
        `Blancco status: ${response.status}, message: ${response.statusText}`
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
            `Error parsing JSON file ${entry.name}: ${error.message}`
          );
        }
      }
    });

    return resultObject;
  }
}