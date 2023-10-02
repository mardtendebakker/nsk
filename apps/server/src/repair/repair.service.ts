import { Injectable } from '@nestjs/common';
import { RepairRepository } from './repair.repository';
import { PrintService } from '../print/print.service';
import { FileService } from '../file/file.service';
import { CreateOrderStatusDto } from '../admin/order-status/dto/create-order-status.dto';
import { OrderStatusService } from '../admin/order-status/order-status.service';
import { CreateAOrderDto } from '../aorder/dto/create-aorder.dto';
import { Prisma } from '@prisma/client';
import { SaleService } from '../sale/sale.service';
import { AProductService } from '../aproduct/aproduct.service';
import { REPAIR_PRODUCT_LOCATION_ID, REPAIR_PRODUCT_NAME } from '../to-repair/enum/repair-product.const';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class RepairService extends SaleService {
  constructor(
    protected readonly repository: RepairRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
    protected readonly customerService: CustomerService,
    protected readonly aProductService: AProductService,
    protected readonly orderStatusService: OrderStatusService,
  ) {
    super(repository, printService, fileService, customerService, aProductService, orderStatusService);
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
            create: this.getToRepairCreateInput()
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
      name: 'To repair',
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
