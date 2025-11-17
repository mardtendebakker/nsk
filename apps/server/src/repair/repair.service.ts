import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RepairRepository } from './repair.repository';
import { PrintService } from '../print/print.service';
import { FileService } from '../file/file.service';
import { CreateOrderStatusDto } from '../admin/order-status/dto/create-order-status.dto';
import { OrderStatusService } from '../admin/order-status/order-status.service';
import { CreateAOrderDto } from '../aorder/dto/create-aorder.dto';
import { SaleService } from '../sale/sale.service';
import { AProductService } from '../aproduct/aproduct.service';
import { REPAIR_PRODUCT_LOCATION_ID, REPAIR_PRODUCT_NAME } from '../to-repair/enum/repair-product.const';
import { ContactService } from '../contact/contact.service';
import { OrderStatuses } from '../admin/order-status/enums/order-statuses.enum';
import { ProductLogService } from '../log/product-log.service';
import { AorderLogService } from '../log/aorder-log.service';

@Injectable()
export class RepairService extends SaleService {
  constructor(
    protected readonly repository: RepairRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
    protected readonly contactService: ContactService,
    protected readonly aProductService: AProductService,
    protected readonly orderStatusService: OrderStatusService,
    protected readonly productLogService: ProductLogService,
    protected readonly aorderLogService: AorderLogService,
  ) {
    super(repository, printService, fileService, contactService, aProductService, orderStatusService, productLogService, aorderLogService);
  }

  async create(orderDto: CreateAOrderDto) {
    const newOrderDto = await this.generateRepairBaseInput(orderDto);
    return super.create(newOrderDto);
  }

  private async generateRepairBaseInput(orderDto: CreateAOrderDto): Promise<CreateAOrderDto> {
    const service1 = this.getCreateSalesServiceInput('1. Replacement: ...');
    const service2 = this.getCreateSalesServiceInput('2a. Research: ...');
    const service3 = this.getCreateSalesServiceInput('2b. Repair ...till €50,-- ...');
    const service4 = this.getCreateSalesServiceInput('3. Backup by ...us/customer...');

    const orderStatus = await this.findRepairOrderStatusOrCreate();

    return {
      ...orderDto,
      status_id: orderStatus.id,
      product_order: {
        create: {
          product: {
            create: this.getToRepairCreateInput(),
          },
          quantity: 1,
          aservice: {
            createMany: {
              data: [service1, service2, service3, service4],
            },
          },
        },
      },
      repair: {
        damage: orderDto?.repair?.damage ?? null,
        description: orderDto?.repair?.description ?? null,
      },
    };
  }

  private findRepairOrderStatusOrCreate() {
    const createOrderStatusDto: CreateOrderStatusDto = {
      name: OrderStatuses.TO_REPAIR,
      is_purchase: false,
      is_sale: false,
      is_repair: true,
    };

    return this.orderStatusService.findByNameOrCreate(createOrderStatusDto);
  }

  private getToRepairCreateInput() {
    const productToRepair: Prisma.productUncheckedCreateInput = {
      name: REPAIR_PRODUCT_NAME,
      location_id: REPAIR_PRODUCT_LOCATION_ID,
      sku: String(Math.floor(Date.now() / 1000)),
    };

    return productToRepair;
  }
}
