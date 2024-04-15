import {
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as xlsx from 'xlsx';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { AOrderService } from '../aorder/aorder.service';
import { SaleRepository } from './sale.repository';
import { PrintService } from '../print/print.service';
import { FileService } from '../file/file.service';
import { AProductService } from '../aproduct/aproduct.service';
import { CreateAServiceDto } from '../aservice/dto/create-aservice.dto';
import { AServiceDiscrimination } from '../aservice/enum/aservice-discrimination.enum';
import { AServiceStatus } from '../aservice/enum/aservice-status.enum';
import { ImportDto } from './dto/import-dto';
import { CreateAOrderDto } from '../aorder/dto/create-aorder.dto';
import { OrderStatusService } from '../admin/order-status/order-status.service';
import { CreateOrderStatusDto } from '../admin/order-status/dto/create-order-status.dto';
import { CreateContactDto } from '../contact/dto/create-contact.dto';
import { IExcelColumn } from './types/excel-column';
import { ContactService } from '../contact/contact.service';
import { AOrderProcessed } from '../aorder/types/aorder-processed';

@Injectable()
export class SaleService extends AOrderService {
  constructor(
    protected readonly repository: SaleRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
    protected readonly contactService: ContactService,
    protected readonly aProductService: AProductService,
    protected readonly orderStatusService: OrderStatusService,
  ) {
    super(repository, printService, fileService, contactService, AOrderDiscrimination.SALE);
  }

  async addProducts(id: number, productIds: number[]) {
    const products = await this.aProductService.findAll({
      where: { id: { in: productIds } },
      excludeByOrderId: id,
    });

    if (!this.areProductIdsEqual(productIds, products.data.map((p) => p.id))) {
      throw new UnprocessableEntityException(
        'One or more products already exist in this order',
      );
    }

    if (products.data.some((p) => p.sale <= 0)) {
      throw new UnprocessableEntityException(
        'One or more products are not saleable',
      );
    }

    const productOrderData: Prisma.product_orderCreateManyAorderInput[] = products.data
      .map((product) => ({
        product_id: product.id,
        price: product.price,
        quantity: 1,
      }));

    const addProductsToOrderParams: Prisma.aorderUpdateArgs = {
      where: { id },
      data: {
        product_order: {
          createMany: {
            data: productOrderData,
          },
        },
      },
    };

    this.aProductService.updateMany({
      ids: productIds,
      product: { orderUpdatedAt: new Date() },
    });

    return this.repository.update(this.commonIncludePart(addProductsToOrderParams));
  }

  async removeProducts(id: number, productIds: number[]) {
    const deleteProductsFromOrderParams: Prisma.aorderUpdateArgs = {
      where: { id },
      data: {
        product_order: {
          deleteMany: {
            product_id: {
              in: productIds,
            },
          },
        },
      },
    };

    return this.repository.update(this.commonIncludePart(deleteProductsFromOrderParams));
  }

  async import(
    importDto: ImportDto,
    file: Express.Multer.File,
    email?: string,
  ): Promise<AOrderProcessed[]> {
    if (!file) {
      throw new UnprocessableEntityException('file is invalid');
    }

    let partnerId: number;
    if (email) {
      partnerId = (await this.contactService.findPartnerByEmail(email))?.id;
    } else {
      partnerId = importDto.partner_id;
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = <IExcelColumn[]>xlsx.utils.sheet_to_json(sheet, { rawNumbers: false });

    const salesP: Promise<AOrderProcessed>[] = [];

    rows.forEach(async (row) => {
      const {
        Referentie,
        Bedrijfsnaam,
        Voornaam,
        Achternaam,
        Straatnaam,
        Huisnummer,
        'Huisnummer toevoeging': HuisnummerToevoeging,
        Postcode,
        Plaatsnaam,
        Landcode,
        Email,
        Telefoon,
        'Mobiel nummer': MobielNummer,
        Gebouw,
        Verdieping,
        Afdeling,
        Deurcode,
        'Aflever referentie': AfleverReferentie,
      } = row;

      if (Bedrijfsnaam || Voornaam || Achternaam) {
      // Leergeld puts partner name in field Bedrijfsnaam :-(
        const companyName = Bedrijfsnaam && !Bedrijfsnaam.includes('Leergeld')
          ? Bedrijfsnaam
          : `${Voornaam} ${Achternaam}`.trim();

        const customerData: CreateContactDto = {
          name: `${Voornaam} ${Achternaam}`.trim(),
          company_name: companyName,
          street: `${Straatnaam} ${Huisnummer} ${HuisnummerToevoeging}`.trim(),
          zip: Postcode,
          city: Plaatsnaam,
          country: Landcode,
          email: Email,
          phone: Telefoon,
          phone2: MobielNummer,
          company_is_customer: true,
          company_is_partner: false,
          company_is_supplier: false,
          ...(partnerId && { company_partner_id: partnerId }),
        };

        const customer = await this.contactService.checkExists(customerData);
        const orderStatus = await this.findOrderStatusByNameOrCreate('Products to assign', false, true, false);
        const remarks = `Referentie: ${Referentie || ''}\r\n`
                      + `Gebouw: ${Gebouw || ''}\r\n`
                      + `Verdieping: ${Verdieping || ''}\r\n`
                      + `Afdeling: ${Afdeling || ''}\r\n`
                      + `Deurcode: ${Deurcode || ''}\r\n`
                      + `Aflever referentie: ${AfleverReferentie || ''}`;

        const saleData: CreateAOrderDto = {
          customer_id: customer.id,
          is_gift: false,
          status_id: orderStatus.id,
          remarks,
        };

        salesP.push(super.create(saleData));
      }
    });

    return Promise.all(salesP);
  }

  protected getCreateSalesServiceInput(description: string): CreateAServiceDto {
    const toDoServie: CreateAServiceDto = {
      discr: AServiceDiscrimination.SalesService,
      status: AServiceStatus.STATUS_TODO,
      description,
    };

    return toDoServie;
  }

  protected findOrderStatusByNameOrCreate(
    name: string,
    isPurchase: boolean,
    isSale: boolean,
    isRepair: boolean,
  ) {
    const createOrderStatusDto: CreateOrderStatusDto = {
      name,
      is_purchase: isPurchase,
      is_sale: isSale,
      is_repair: isRepair,
    };

    return this.orderStatusService.findByNameOrCreate(createOrderStatusDto);
  }

  private areProductIdsEqual(poductIds1: number[], poductIds2: number[]): boolean {
    if (poductIds1.length !== poductIds2.length) {
      return false;
    }
    return poductIds1.every((item) => poductIds2.includes(item));
  }
}
