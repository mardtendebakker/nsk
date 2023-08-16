import { Injectable } from '@nestjs/common';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { AOrderService } from '../aorder/aorder.service';
import { RepairRepository } from './repair.repository';
import { PrintService } from '../print/print.service';
import { FileService } from '../file/file.service';
import { CreateOrderStatusDto } from '../order-status/dto/create-order-status.dto';
import { OrderStatusService } from '../order-status/order-status.service';
import { CreateAOrderDto } from '../aorder/dto/create-aorder.dto';
import { ToRepairService } from '../to-repair/to-repair.service';
import { aorder } from '@prisma/client';
import { SalesServiceService } from '../sales-service/sales-service.service';

@Injectable()
export class RepairService extends AOrderService {
  constructor(
    protected readonly repository: RepairRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
    private readonly orderStatusService: OrderStatusService,
    private readonly toRepairService: ToRepairService,
    private readonly salesServiceService: SalesServiceService,
  ) {
    super(repository, printService, fileService, AOrderDiscrimination.SALE);
  }

  async create(): Promise<aorder> {
    const orderDto = await this.generateRepairBaseInput();
    return super.create(orderDto);
  }

  private async generateRepairBaseInput(): Promise<CreateAOrderDto> {
    const service1 = this.salesServiceService.getCreateInput('1. Replacement: ...');
    const service2 = this.salesServiceService.getCreateInput('2a. Research: ...');
    const service3 = this.salesServiceService.getCreateInput('2b. Repair ...till €50,-- ...');
    const service4 = this.salesServiceService.getCreateInput('3. Backup by ...us/customer...');

    const orderStatus = await this.findRepairOrderStatusOrCreate();

    return {
      status_id: orderStatus.id,
      product_order: {
        create: {
          product: {
            create: this.toRepairService.getCreateInput()
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
        damage: null,
        description: null,
      },
    };
  }

  private findRepairOrderStatusOrCreate() {
    const createOrderStatusDto: CreateOrderStatusDto = {
      name: 'To repair',
      is_purchase: false,
      is_sale: true,
    };

    return this.orderStatusService.findByNameOrCreate(createOrderStatusDto);
  }
}
