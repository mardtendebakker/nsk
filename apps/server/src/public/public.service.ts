import {
  BadRequestException, HttpException, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { afile } from '@prisma/client';
import { PurchaseService } from '../purchase/purchase.service';
import { PostPickupDto, PickupFormDto } from './dto/post-pickup.dto';
import { OrderStatusService } from '../admin/order-status/order-status.service';
import { CreateOrderStatusDto } from '../admin/order-status/dto/create-order-status.dto';
import { FileService } from '../file/file.service';
import { CreateFileDto } from '../file/dto/create-file.dto';
import { FileDiscrimination } from '../file/types/file-discrimination.enum';
import { CreateAOrderDto } from '../aorder/dto/create-aorder.dto';
import { CreatePickupUncheckedWithoutAorderInputDto } from '../calendar/pickup/dto/create-pickup-unchecked-without-aorder-input.dto';
import { ProductService } from '../product/product.service';
import { DataDestruction } from '../calendar/pickup/types/destruction.enum';
import { DataDestructionChoice } from './types/data-destruction-choise';
import { CreateBodyStockDto } from '../stock/dto/create-body-stock.dto';
import { PartialProductRelation } from '../stock/types/product-relation';
import { PostOrderDto } from './dto/post-order.dto';
import { SaleService } from '../sale/sale.service';
import { PostImportDto } from './dto/post-import.dto';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class PublicService {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly saleService: SaleService,
    private readonly contactService: ContactService,
    private readonly orderStatusService: OrderStatusService,
    private readonly fileService: FileService,
    private readonly productService: ProductService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getAllProductTypes() {
    return this.productService.getAllPublicTypes();
  }

  getDataDestructionChoices(): DataDestructionChoice {
    const dataDestructionChoices: DataDestructionChoice = new Map();
    dataDestructionChoices.set(DataDestruction.DATADESTRUCTION_KILLDISK, 'HDD wipe report');
    dataDestructionChoices.set(DataDestruction.DATADESTRUCTION_NONE, 'Geen HDD aangeleverd');
    dataDestructionChoices.set(DataDestruction.DATADESTRUCTION_SHRED, 'HDD op locatie shredden a €12,50 (extra 0.89ct per KM)');

    return dataDestructionChoices;
  }

  getPickupForm() {
    return {
      form: {
        supplier: this.getContactForm(),
        countAddresses: {
          label: 'Aantal ophaaladressen',
          required: true,
          value: 0,
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
      },
    };
  }

  async postPickup(params: PostPickupDto, files?: Express.Multer.File[]): Promise<void> {
    const { pickup_form: pickupForm } = params;

    await this.captchaVerify(params['g-recaptcha-response']);

    pickupForm.supplier.company_is_supplier = true;
    const supplier = await this.contactService.checkExists(pickupForm.supplier);

    const pickupData: CreatePickupUncheckedWithoutAorderInputDto = {
      origin: pickupForm.origin,
      data_destruction: pickupForm.dataDestruction,
      description: pickupForm.description,
      pickup_date: pickupForm.pickupDate,
    };

    const orderStatus = await this.findOrderStatusByNameOrCreate(pickupForm.orderStatusName, true, false, false);

    const purchaseData: CreateAOrderDto = {
      supplier_id: supplier.id,
      pickup: pickupData,
      is_gift: true,
      status_id: orderStatus.id,
    };

    const purchase = await this.purchaseService.create(purchaseData);

    if (files?.length) {
      await this.uploadFiles(purchase.pickup.id, files);
    }

    await this.createProductsForPickup(pickupForm, purchase.id);

    // TODO: sendStatusMail
  }

  getOrderForm() {
    return {
      form: {
        customer: this.getContactForm(),
      },
    };
  }

  async postOrder(params: PostOrderDto): Promise<void> {
    const { public_order_form: publicOrderForm } = params;

    await this.captchaVerify(params['g-recaptcha-response']);

    publicOrderForm.customer.company_is_customer = true;
    const customer = await this.contactService.checkExists(publicOrderForm.customer);

    const orderStatus = await this.findOrderStatusByNameOrCreate(publicOrderForm.orderStatusName, false, true, false);

    let remarks = '';

    for (const product of publicOrderForm.products) {
      if (product.quantity > 0) {
        remarks += `${product.name}: ${product.quantity}x\r\n`;
      }
    }

    if (remarks.length < 4) {
      remarks = 'No quantities entered...';
    }

    const saleData: CreateAOrderDto = {
      customer_id: customer.id,
      is_gift: false,
      status_id: orderStatus.id,
      remarks,
    };

    await this.saleService.create(saleData);
  }

  async importSales(authorization:string, params: PostImportDto, file: Express.Multer.File): Promise<void> {
    if (authorization !== this.configService.get<string>('LEERGELD_DENHAAG_AUTH')) {
      throw new UnauthorizedException('Username or Password is invalid!');
    }
    const { import_form: importForm } = params;

    await this.captchaVerify(params['g-recaptcha-response']);

    await this.saleService.import({
      partner_id: importForm.partnerId,
    }, file);
  }

  getPostPickupSuccessMessage(): string {
    return `Hartelijk dank voor uw online aanmelding. Als u dit bericht ziet, is uw bericht in ons systeem geland.
    Uw informatie is ontvangen en wordt zo snel mogelijk verwerkt. U krijgt een automatische email ter bevestiging.
    De logistieke afdeling neemt contact met u op zodra er een planning bekend is.
    
    Heeft u vragen of is er spoed geboden? Belt u ons dan meteen via 070 2136312.
    U mag ook mailen naar logistiek@copiatek.nl Zet u voor de zekerheid dit emailadres in uw Whitelist.`;
  }

  getPostOrderSuccessMessage(): string {
    return `Hartelijk dank voor uw interesse in onze producten. 
    Heeft u vragen of is er spoed geboden? Belt u ons dan meteen via 070 2136312.
    Wij nemen contact met u op over uw bestelling.`;
  }

  private getContactForm() {
    return {
      name: {
        label: 'Contactpersoon',
        required: false,
      },
      company_name: {
        label: 'Bedrijfsnaam van de klant',
        required: true,
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
    };
  }

  private async uploadFiles(pickupId: number, pickupFiles: Express.Multer.File[]): Promise<afile[]> {
    const afiles: afile[] = [];
    // group files by attribute id
    const filesGroupByFileDiscr: { [key in FileDiscrimination]?: Express.Multer.File[] } = pickupFiles.reduce((acc, obj) => {
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
        // eslint-disable-next-line no-await-in-loop
        const aFile = await this.fileService.create(createFileDto, {
          Body: file.buffer,
          ContentType: file.mimetype,
        });
        afiles.push(aFile);
      }
    }

    return afiles;
  }

  private findOrderStatusByNameOrCreate(name: string, isPurchase: boolean, isSale: boolean, isRepair: boolean) {
    const createOrderStatusDto: CreateOrderStatusDto = {
      name,
      is_purchase: isPurchase,
      is_sale: isSale,
      is_repair: isRepair,
    };

    return this.orderStatusService.findByNameOrCreate(createOrderStatusDto);
  }

  private async createProductsForPickup(params: PickupFormDto, order_id: number): Promise<PartialProductRelation[]> {
    let count = 0;
    let { countAddresses } = params;
    const { locationId, quantityAddresses } = params;
    if (!countAddresses) countAddresses = 1;
    const products: PartialProductRelation[] = [];

    for (let i = 0; i < quantityAddresses.length; i++) {
      const quantityProductTypes = quantityAddresses[i];
      // eslint-disable-next-line guard-for-in
      for (const key in quantityProductTypes) {
        const quantity = Number(quantityProductTypes[key]);

        if (quantity > 0) {
          let address = `${params.addresses[i].address}, ${
            `${params.addresses[i].address_zip} 
            ${params.addresses[i].address_city}`.trim()}`;

          if (address === ', ' && i === 0) {
            address = `${params.supplier.street}, ${
              `${params.supplier.zip} ${params.supplier.city}`.trim()}`;
          } else if (address === ', ') {
            address = `Address ${i + 1}`;
          } else {
            address = `Pickup address: ${address}`;
          }

          const productDto: CreateBodyStockDto = {
            name: address,
            sku: String(Math.floor(Date.now() / 1000) + count),
            location_id: locationId,
            description: 'Created by application',
            type_id: Number(key.split('type_id_')[1]),
            product_orders: [
              {
                order_id,
                quantity,
              },
            ],
          };

          // eslint-disable-next-line no-await-in-loop
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
        response: recaptcha,
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
    }
    throw new BadRequestException(`recaptcha failed: ${data['error-codes']}`);
  }
}
