/* eslint-disable no-await-in-loop */
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as xlsx from 'xlsx';
import { HttpService } from '@nestjs/axios';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { AOrderService } from '../aorder/aorder.service';
import { SaleRepository } from './sale.repository';
import { PrintService } from '../print/print.service';
import { FileService } from '../file/file.service';
import { AProductService } from '../aproduct/aproduct.service';
import { ProductService } from '../product/product.service';
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
import { IProductToOrder } from './types/product-to-order';
import { OrderStatuses } from '../admin/order-status/enums/order-statuses.enum';
import { ProductLogService } from '../log/product-log.service';
import { AorderLogService } from '../log/aorder-log.service';
import { ExactService } from '../exact/exact.service';

@Injectable()
export class SaleService extends AOrderService {
  constructor(
    protected readonly repository: SaleRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
    protected readonly contactService: ContactService,
    protected readonly aProductService: AProductService,
    protected readonly productService: ProductService,
    protected readonly orderStatusService: OrderStatusService,
    protected readonly productLogService: ProductLogService,
    protected readonly aorderLogService: AorderLogService,
    protected readonly httpService: HttpService,
    private readonly exactService: ExactService,
  ) {
    super(repository, printService, fileService, contactService, aorderLogService, AOrderDiscrimination.SALE);
  }

  async requestExactInvoice(orderId: number, body: { token: string }) {
    const orderWithDetails = await this.repository.findOne({
      where: { id: orderId },
      include: {
        contact_aorder_customer_idTocontact: {
          include: {
            company_contact_company_idTocompany: true,
          },
        },
        product_order: {
          include: {
            product: true,
          },
        },
      },
    }) as any;

    if (!orderWithDetails) {
      throw new NotFoundException('Sales order not found!');
    }

    const customer = orderWithDetails.contact_aorder_customer_idTocontact;
    const company = customer?.company_contact_company_idTocompany;
    const products = orderWithDetails.product_order;

    if (!customer || !company) {
      throw new UnprocessableEntityException('Customer information is missing');
    }

    if (!products || products.length === 0) {
      throw new UnprocessableEntityException('No products found in order');
    }

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    let customerId = company.exact_id;

    if (!customerId) {
      const createdCustomer = await this.exactService.createCustomer({
        Name: customer.name,
        Email: customer.email,
        Status: 'C',
      }, body);
      customerId = createdCustomer.ID;

      await this.repository.update({
        where: { id: orderId },
        data: {
          contact_aorder_customer_idTocontact: {
            update: {
              exact_id: createdCustomer.ID,
            },
          },
        },
      });
    }

    const salesInvoiceLines = [];
    for (const productOrder of products) {
      const itemCode = productOrder.product.sku || productOrder.product.name;

      if (!productOrder.product.exact_id) {
        const itemData = {
          Code: itemCode,
          Description: productOrder.product.name,
          Unit: 'PCS',
          ItemGroup: '1',
        };
        const createdItem = await this.exactService.createItem(itemData, body);

        await this.productService.updateOne(productOrder.product.id, { exact_id: createdItem.ID });
      }

      salesInvoiceLines.push({
        Item: productOrder.product.exact_id || itemCode,
        Quantity: productOrder.quantity || 1,
        UnitPrice: productOrder.price || 0,
        Description: productOrder.product.name,
      });
    }

    const exactResponse = await this.exactService.createSalesInvoice({
      Customer: customerId,
      Description: orderWithDetails.remarks || `Order ${orderWithDetails.order_nr || orderId}`,
      DocumentDate: formatDate(orderWithDetails.order_date),
      InvoiceDate: formatDate(new Date()),
      InvoiceTo: customer.name || company.name,
      OrderDate: formatDate(orderWithDetails.order_date),
      OrderNumber: orderWithDetails.order_nr || orderId.toString(),
      SalesInvoiceLines: salesInvoiceLines,
    }, body);

    await this.repository.update({
      where: { id: orderId },
      data: {
        exact_invoice_id: exactResponse.InvoiceID,
        remarks: `${orderWithDetails.remarks || ''}\n\nExact Invoice: ${exactResponse.InvoiceNumber} (ID: ${exactResponse.InvoiceID})`,
      },
    });

    return {
      invoiceId: exactResponse.InvoiceID,
      invoiceNumber: exactResponse.InvoiceNumber,
    };
  }

  async addProducts(id: number, productsToOrder: IProductToOrder[]) {
    const productIds = productsToOrder.map(({ productId }) => productId);
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

    const order = await this.repository.findOne({ where: { id }, select: { order_nr: true } });

    const productOrderData: Prisma.product_orderCreateManyAorderInput[] = products.data
      .map((product) => ({
        product_id: product.id,
        price: product.price,
        quantity: productsToOrder.find((pToOrder) => pToOrder.productId === product.id).quantity || 1,
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

    const updatedOrder = await this.repository.update(this.commonIncludePart(addProductsToOrderParams));

    for (const product of products.data) {
      this.productLogService.create({
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        order_nr: order?.order_nr || '',
        action: 'add',
      } as any).catch((e) => console.log(e.message));
    }

    return updatedOrder;
  }

  async removeProducts(id: number, productIds: number[]) {
    const order = await this.repository.findOne({
      where: { id },
      include: {
        product_order: {
          where: {
            product_id: { in: productIds },
          },
          include: {
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });

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

    const updatedOrder = await this.repository.update(this.commonIncludePart(deleteProductsFromOrderParams));

    const orderWithProducts = order as any;
    if (orderWithProducts?.product_order) {
      for (const productOrder of orderWithProducts.product_order) {
        this.productLogService.create({
          product_id: productOrder.product_id,
          name: productOrder.product.name,
          sku: productOrder.product.sku,
          order_nr: orderWithProducts.order_nr || '',
          action: 'delete',
        } as any).catch((e) => console.log(e.message));
      }
    }

    return updatedOrder;
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

    const sales: AOrderProcessed[] = [];

    for (const row of rows) {
      const {
        __EMPTY: ZonderTitel,
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
        let companyName: string;

        if (Bedrijfsnaam && !Bedrijfsnaam?.includes('Leergeld')) {
          companyName = Bedrijfsnaam;
        } else if (Bedrijfsnaam?.includes('Leergeld Den Haag')) {
          companyName = Voornaam;
        } else {
          companyName = `${Voornaam} ${Achternaam ?? ''}`.trim();
        }

        let contactName: string;

        if (Bedrijfsnaam?.includes('Leergeld') && AfleverReferentie?.trim()) {
          contactName = AfleverReferentie;
        } else {
          contactName = `${Voornaam} ${Achternaam ?? ''}`.trim();
        }

        const customerData: CreateContactDto = {
          name: contactName,
          company_name: companyName,
          street: `${Straatnaam} ${Huisnummer} ${HuisnummerToevoeging ?? ''}`.trim(),
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
        const orderStatus = await this.findOrderStatusByNameOrCreate(OrderStatuses.PRODUCTS_TO_ASSIGN, false, true, false);
        const remarks = `Referentie: ${Referentie || ''}\r\n`
                      + `Gebouw: ${Gebouw || ''}\r\n`
                      + `Verdieping: ${Verdieping || ''}\r\n`
                      + `Afdeling: ${Afdeling || ''}\r\n`
                      + `Deurcode: ${Deurcode || ''}\r\n`
                      + `Aflever referentie: ${AfleverReferentie || ''}\r\n`
                      + `Zonder titel: ${ZonderTitel || ''}`;

        const saleData: CreateAOrderDto = {
          customer_id: customer.id,
          is_gift: false,
          status_id: orderStatus.id,
          remarks,
        };

        try {
          sales.push(await super.create(saleData));
        } catch (e) {
          console.log('sale import e', e);
        }
      }
    }

    return sales;
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
