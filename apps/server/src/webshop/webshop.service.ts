import {
  HttpException, Injectable, Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Order } from './dto/find-order-response.dto';
import { ProductRelation } from '../stock/types/product-relation';
import { FileService } from '../file/file.service';
import { AttributeType } from '../attribute/enum/attribute-type.enum';
import { FILE_VALUE_DELIMITER } from '../stock/types/file-value-delimiter.const';

@Injectable()
export class WebshopService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private fileService: FileService,

  ) {}

  async fetchOrderById(orderId: string): Promise<Order | null> {
    const response = await lastValueFrom(
      this.httpService.get(
        `${this.configService.get<string>('MAGENTO_BASE_URL')}rest/V1/nexxus/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${this.configService.get<string>('MAGENTO_API_KEY')}` } },
      ).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      ),
    );

    const { data } = response;

    if (!data?.id) {
      return null;
    }

    const address = data.shipping_address;

    return Object.assign(new Order(), {
      id: orderId,
      customer: {
        city: address.city,
        country: address.country,
        email: address.email,
        name: `${address.firstname} ${address.lastname}`,
        phone: address.telephone,
        street: address.street,
        zipcode: address.postcode,
      },
      transport: data.shipping_amount,
      products: data.items.map(({ nexxusId }) => ({ id: nexxusId })),
    });
  }

  async addProduct(product: ProductRelation, availableQuantity: number): Promise<void> {
    try {
      const entries2d = await this.getAllEntries(product);

      const entries = [].concat(...entries2d);

      const result = await lastValueFrom(
        this.httpService.post(
          `${this.configService.get<string>('MAGENTO_BASE_URL')}rest/V1/products`,
          {
            product: {
              sku: product.sku,
              name: this.getProductNameUrl(product),
              attribute_set_id: 4,
              price: product.price,
              extension_attributes: {
                category_links: product.product_type.magento_category_id ? [
                  {
                    position: 0,
                    category_id: product.product_type.magento_category_id,
                  },
                ] : undefined,
                stock_item: {
                  qty: availableQuantity,
                  is_in_stock: availableQuantity > 0 && product.price > 0,
                },
              },
              custom_attributes: [
                {
                  attribute_code: 'nexxus_id',
                  value: product.id.toString(),
                },
                {
                  attribute_code: 'meta_title',
                  value: product.name,
                },
                {
                  attribute_code: 'meta_description',
                  value: product.description,
                },
                {
                  attribute_code: 'short_description',
                  value: product.description,
                },
                {
                  attribute_code: 'description',
                  value: product.description,
                },
              ],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.configService.get<string>('MAGENTO_API_KEY')}`,
            },
          },
        ).pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
      );

      entries.forEach(async (entry) => {
        await lastValueFrom(
          this.httpService.post(
            `${this.configService.get<string>('MAGENTO_BASE_URL')}rest/V1/products/${result.data.sku}/media`,
            {
              entry,
            },
            {
              headers: {
                Authorization: `Bearer ${this.configService.get<string>('MAGENTO_API_KEY')}`,
              },
            },
          ).pipe(
            catchError((error: AxiosError) => {
              throw new HttpException(error.response.data, error.response.status);
            }),
          ),
        );
      });
    } catch (e) {
      if (e?.status === 400) {
        Logger.error(e?.response?.message);
      } else {
        throw e;
      }
    }
  }

  private async getAllEntries(product: ProductRelation): Promise<any[][]> {
    const entriesPromises = product.product_attribute_product_attribute_product_idToproduct.map(async (productAttribute) => {
      let entries = [];
      const isFile = productAttribute?.attribute?.type === AttributeType.TYPE_FILE;
      if (isFile) {
        const fileIds = productAttribute?.value?.split(FILE_VALUE_DELIMITER).map(Number) || [];

        entries = await this.getEntries(fileIds, this.getProductNameUrl(product), productAttribute.attribute_id);
      }

      return entries;
    });

    return Promise.all(entriesPromises);
  }

  private async getEntries(fileIds: number[], label: string, attributeId: number): Promise<any[]> {
    const entryPromises = fileIds.map(async (fileId) => {
      const file = await this.fileService.get(fileId);
      const entry = {
        media_type: 'image',
        label,
        position: 1,
        disabled: false,
        types: [
          'thumbnail', 'image', 'small_image', 'swatch_image',
        ],
        content:
        {
          base64_encoded_data: await file.Body.transformToString('base64'),
          type: file.ContentType,
          name: String(attributeId),
        },
      };

      return entry;
    });

    return Promise.all(entryPromises);
  }

  private generateRandomHash(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let hash = '';
    for (let i = 0; i < length; i++) {
      hash += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return hash;
  }

  private getProductNameUrl(product: ProductRelation): string {
    return `${product.name.replace(/ /g, '-')}-${product.id}-${this.generateRandomHash(8)}`;
  }
}
