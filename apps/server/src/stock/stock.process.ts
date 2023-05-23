
import { Prisma, aservice, product, product_order, product_type_task } from "@prisma/client";
import { AttributeType } from "../attribute/enum/attribute-type.enum";
import { AOrderDiscrimination } from "../aorder/types/aorder-discrimination.enum";
import { StockRepository } from "./stock.repository";
import { ServiceStatus } from "../service/enum/service-status.enum";
import { ProcessedTask } from "./dto/find-product-respone.dto";

export class StockProcess {
  private isSaleable: boolean;
  private isSaleAndRepair: boolean;
  private productPurchaseOrder: product_order; //TODO: Prisma.PromiseReturnType<typeof product_order_repository.findOne>
  private productSaleOrders: product_order[]; //TODO: Prisma.PromiseReturnType<typeof product_order_repository.findOne>[]
  
  private locationName: string;
  private aservices: aservice[];
  private orderDate: Date;
  private orderNumber: string;
  private productTypeTasks: product_type_task[];
  private rest: Partial<product>;

  private processedTasks: ProcessedTask[];
  private attributedQuantity: number = null;
  private quantitySold: number = null;
  private quantityPurchased: number = null;
  private quantitySaleable: number = null;
  private quantityInStock: number = null;
  private quantityOnHold: number = null;
  private splittable: boolean;

  constructor(
    private readonly repository: StockRepository,
    private readonly product: Prisma.PromiseReturnType<typeof repository.findOne>,
    private readonly productSelect: Prisma.productSelect
  ) {
    this.init();
  }

  private init() {
    const {
      product_order,
      product_type,
      product_status,
      location,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      product_attribute_product_attribute_value_product_idToproduct,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      product_attribute_product_attribute_product_idToproduct,
      ...rest
    } = this.product;

    this.rest = rest;
    this.locationName = location?.name;
    
    this.aservices = product_order?.[0]?.['aservice'] || [];
    this.orderDate = product_order?.[0]?.['aorder']?.order_date;
    this.orderNumber = product_order?.[0]?.['aorder']?.order_nr;
    this.productTypeTasks = product_type?.['product_type_task'] || [];

    this.productPurchaseOrder = product_order.find(po => po['aorder']?.discr == AOrderDiscrimination.PURCHASE);
    this.productSaleOrders = product_order.filter(po => po['aorder']?.discr == AOrderDiscrimination.SALE);

    this.isSaleable = product_status ? product_status?.is_saleable ?? true : false;
    this.isSaleAndRepair = this.productSaleOrders.length == 1 && this.productSaleOrders?.[0]['aorder']?.repair?.id;
  }
  
  public async run() {
    this.processedTasks = this.processTasks();
    this.quantitySold = await this.getQuantitySold();
    this.quantityPurchased = this.getQuantityPurchased();
    this.quantitySaleable = await this.getQuantitySaleable();
    this.quantityInStock = await this.getQuantityInStock();
    this.quantityOnHold = await this.getQuantityOnHold();
    this.splittable = this.quantityPurchased > 1;
    
    return {
      ...this.rest,
      location: this.locationName,
      purch: this.quantityPurchased,
      stock: this.quantityInStock,
      hold: this.quantityOnHold,
      sale: this.quantitySaleable,
      sold: this.quantitySold,
      order_date: this.orderDate,
      order_nr: this.orderNumber,
      tasks: this.processedTasks,
      splittable: this.splittable,
    };
  }

  private processTasks(): ProcessedTask[] {
    return this.productTypeTasks.map(productTypeTask => {
      const processedTask: ProcessedTask = {
        name: productTypeTask['task'].name,
        description: productTypeTask['task'].description,
        status: ServiceStatus.STATUS_TODO,
      };
      for (let i = 0; i < this.aservices.length; i++) {
        const service = this.aservices[i];
        if (productTypeTask['task'].id === service.task_id) {
          processedTask.status = service.status;
          break;
        }
      }
      return processedTask;
    });
  }

  private getAttributedQuantity() {
    const { product_attribute_product_attribute_value_product_idToproduct: product_attributeds } = this.product;
    const product_attributed = product_attributeds[0];
    let attributedQuantity = 1;
    
    if (product_attributed['attribute'].type == AttributeType.TYPE_PRODUCT &&
      product_attributed['attribute'].has_quantity &&
      product_attributed.quantity != null) {
        attributedQuantity = product_attributed.quantity;
    }

    this.attributedQuantity = attributedQuantity;
    return this.attributedQuantity;
  }

  private async getQuantitySold() {
    const { product_attribute_product_attribute_value_product_idToproduct: product_attributeds } = this.product;
    let quantitySold = 0;

    if (this.isSaleable) {
      
      quantitySold += this.productSaleOrders.reduce((acc, cur) => acc + cur.quantity, 0);
      
      for (let i = 0; i < product_attributeds.length; i++) {

        const product_attributed = product_attributeds[i];
        const quantityPerUnit = this.getAttributedQuantity() || 1;
        let parentProductQuantitySold = 0;

        if (product_attributed['product_product_attribute_product_idToproduct'].id) {
          
          const newProduct = await this.repository.findOne({
            where: {
              id: product_attributed['product_product_attribute_product_idToproduct'].id,
            },
            select: this.productSelect,
          });

          const newProductProcess = new StockProcess(
            this.repository,
            newProduct,
            this.productSelect
          );

          parentProductQuantitySold = await newProductProcess.getQuantitySold() || 0;

        }
        quantitySold += quantityPerUnit * parentProductQuantitySold;
      }
    }
    
    this.quantitySold = quantitySold;
    return this.quantitySold;
  }

  private getQuantityPurchased() {
    let quantityPurchased = 0;

    quantityPurchased = this.productPurchaseOrder ? this.productPurchaseOrder?.quantity ?? 1 : 0;

    this.quantityPurchased = quantityPurchased;
    return this.quantityPurchased;
  }

  private async getQuantitySaleable() {
    let quantitySaleable = 0;

    if (this.isSaleable) {
      quantitySaleable = this.getQuantityPurchased();
    }

    this.quantitySaleable = quantitySaleable - this.quantitySold ?? await this.getQuantitySold();
    return this.quantitySaleable;
  }

  private async getQuantityInStock() {
    let quantityInStock = 0;

    quantityInStock = this.productPurchaseOrder?.quantity || 0;

    if (this.isSaleAndRepair) {
      quantityInStock = this.productSaleOrders?.[0]?.quantity || 0;
    }

    this.quantityInStock = quantityInStock - this.quantitySold ?? await this.getQuantitySold();
    return this.quantityInStock;
  }

  private async getQuantityOnHold() {
    const quantityInStock = this.quantityInStock ?? await this.getQuantityInStock();
    const quantitySaleable = this.quantitySaleable ?? await this.getQuantitySaleable();

    this.quantityOnHold = quantityInStock - quantitySaleable > 0 ? quantityInStock - quantitySaleable : 0;
    return this.quantityOnHold;
  }
}

