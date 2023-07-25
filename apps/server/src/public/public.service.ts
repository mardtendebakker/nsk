import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PurchaseService } from '../purchase/purchase.service';
import { PostPickupDto, PickupFormDto } from './dto/post-pickup.dto';
import { SupplierService } from '../supplier/supplier.service';
import { OrderStatusService } from '../order-status/order-status.service';
import { CreateOrderStatusDto } from '../order-status/dto/create-order-status.dto';
import { FileService } from '../file/file.service';
import { CreateFileDto } from '../file/dto/upload-meta.dto';
import { FileDiscrimination } from '../file/types/file-discrimination.enum';
import { CreateAOrderDto } from '../aorder/dto/create-aorder.dto';
import { CreatePickupUncheckedWithoutAorderInputDto } from '../pickup/dto/create-pickup-unchecked-without-aorder-input.dto';
import { AOrderPayload } from '../aorder/aorder.process';
import { ProductService } from '../product/product.service';
import { ProductRelationGetPayload } from '../stock/stock.process';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { DataDestruction } from '../pickup/types/destruction.enum';
import { DataDestructionChoice } from './types/data-destruction-choise';
import { afile } from '@prisma/client';
import { CreateBodyStockDto } from '../stock/dto/create-body-stock.dto';
@Injectable()
export class PublicService {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly supplierService: SupplierService,
    private readonly orderStatusService: OrderStatusService,
    private readonly fileService: FileService,
    private readonly productService: ProductService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getAllProductTypes() {

    return this.productService.getAllTypes();
  }

  getDataDestructionChoices(): DataDestructionChoice {
    const dataDestructionChoices: DataDestructionChoice = new Map();
    dataDestructionChoices.set(DataDestruction.DATADESTRUCTION_FORMAT, 'Format is voldoende (gratis)');
    dataDestructionChoices.set(DataDestruction.DATADESTRUCTION_NONE, 'Geen HDD aangeleverd');
    dataDestructionChoices.set(DataDestruction.DATADESTRUCTION_STATEMENT, 'Vernietigingsverklaring (gratis)');
    dataDestructionChoices.set(DataDestruction.DATADESTRUCTION_SHRED, 'HDD op locatie shredden a €12,50 (extra 0.89ct per KM)');
    dataDestructionChoices.set(DataDestruction.DATADESTRUCTION_KILLDISK, 'HDD wipe report KillDisk a €3,50');

    return dataDestructionChoices;
  }

  getForm() {
    return {
      form: {
        supplier: {
          name: {
            label: 'Klantnaam',
            required: true,
          },
          representative: {
            label: 'Contactpersoon',
            required: false,
          },
          email: {
            label: 'E-mail',
            required: true,
          },
          phone: {
            label: 'Telefoon',
            required: true,
          },
          street: {
            label: 'Straat + nr',
            required: true,
          },
          zip: {
            label: 'Postcode',
            required: false,
          },
          city: {
            label: 'Woonplaats',
            required: true,
          },
        },
        countAddresses: {
          label: 'Aantal ophaaladressen',
          required: true,
          value: 0
        },
        fileInput: {
          imagesInput: {
            label: 'Afbeeldingen',
            required: false,
            multiple: true,
          },
          agreementInput: {
            label: 'Verwerkingsovereenkomst',
            required: false,
            multiple: false,
          },
        },
      }
    }
  }

  async postPickup(params: PostPickupDto, files?: Express.Multer.File[]) {

    const { pickup_form } = params;

    await this.captchaVerify(params['g-recaptcha-response']);

    const supplier = await this.supplierService.checkExists(pickup_form.supplier);

    const pickupData: CreatePickupUncheckedWithoutAorderInputDto = {
      origin: pickup_form.origin,
      data_destruction: pickup_form.dataDestruction,
      description: pickup_form.description,
      pickup_date: pickup_form.pickupDate,
    };

    const orderStatus = await this.findOrderStatusByNameOrCreate(pickup_form.orderStatusName);

    const purchaseData: CreateAOrderDto = {
      supplier_id: supplier.id,
      pickup: pickupData,
      is_gift: true,
      status_id: orderStatus.id
    };

    const purchase = <AOrderPayload>await this.purchaseService.create(purchaseData);
    
    if (files?.length) {
      await this.uploadFiles(purchase.pickup.id, files);
    }

    const products = await this.createProductsForPickup(pickup_form, purchase.id);
    
    // sendStatusMail
    const message = pickup_form.confirmPage ? pickup_form.confirmPage : "Pickup added successfully";
    //
    return message;
  }

  private async uploadFiles(pickupId: number, files: Express.Multer.File[]): Promise<afile[]> {
    const afiles: afile[] = [];
    // group files by attribute id
    const filesGroupByFileDiscr: { [key in FileDiscrimination]?: Express.Multer.File[]} = files.reduce((acc, obj) => {
      const { fieldname } = obj;

      if (!acc[fieldname]) {
        acc[fieldname] = [];
      }
      
      acc[fieldname].push(obj);
      return acc;
    }, {});

    for (const [fileDiscr, files] of Object.entries(filesGroupByFileDiscr)) {
      const createFileDto: CreateFileDto = {
        discr: <FileDiscrimination>fileDiscr,
        pickup_id: pickupId,
      };

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const afile = await this.fileService.create(createFileDto, file);
        afiles.push(afile);
      }
    }

    return afiles;
  }

  private findOrderStatusByNameOrCreate(name: string) {
    const createOrderStatusDto: CreateOrderStatusDto = {
      name,
      is_purchase: true,
      is_sale: false,
    };

    return this.orderStatusService.findByNameOrCreate(createOrderStatusDto);
  }

  private async createProductsForPickup(params: PickupFormDto, order_id: number): Promise<ProductRelationGetPayload[]> {
    let count = 0;
    let countAddresses = params.countAddresses;
    const { locationId, quantityAddresses } = params;
    if (!countAddresses) countAddresses = 1;
    const products: ProductRelationGetPayload[] = [];

    for (let i = 0; i < quantityAddresses.length; i++) {
      const quantityProductTypes = quantityAddresses[i];
      for (const key in quantityProductTypes) {
        const quantity = Number(quantityProductTypes[key]);

        if (quantity > 0) {
          let address = params.addresses[i].address + ', ' +
            `${params.addresses[i].address_zip} 
            ${params.addresses[i].address_city}`.trim();

          if (address === ', ' && i === 0) {
            address = params.supplier.street + ', ' +
              `${params.supplier.zip} ${params.supplier.city}`.trim();
          } else if (address === ', ') {
            address = `Address ${i + 1}`;
          } else {
            address = 'Pickup address: ' + address;
          }

          const productDto: CreateBodyStockDto = {
            name: address,
            sku: String(Date.now() + count),
            location_id: locationId,
            description: 'Created by application',
            type_id: Number(key.split('type_id_')[1]),
            product_orders: [
              {
                order_id: order_id,
                quantity: quantity,
              }
            ],
          };

          const product = await this.productService.create(productDto);

          products.push(product);

          count++;
        }
      }
    }

    return products;
  }

  private async captchaVerify(recaptcha: string): Promise<boolean> {
    const url = 'https://www.google.com/recaptcha/api/siteverify';

    const requestConfig: AxiosRequestConfig = {
      params: {
        secret: this.configService.get<string>('RECAPTCHA_SECRET'),
        response: recaptcha
      },
    };
    const { data } = await lastValueFrom(
      this.httpService.post(url, null, requestConfig).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      ),
    );

    if (data?.success) {
      return true;
    } else {
      throw new BadRequestException(data['error-codes']);
    }
  }
}
