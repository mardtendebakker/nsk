
import { Prisma, aservice, product, product_order, product_type_task } from "@prisma/client";
import { AttributeType } from "../attribute/enum/attribute-type.enum";
import { AOrderDiscrimination } from "../aorder/types/aorder-discrimination.enum";
import { StockRepository } from "./stock.repository";
import { AServiceStatus } from "../aservice/enum/aservice-status.enum";
import { ProductRelation } from "./types/product-relation";
import { ProcessedTask } from "./dto/processed-task.dto";
import { ProcessedStock } from "./dto/processed-stock.dto";
import { ProductOrderPayload } from "./types/product-order-payload";

export class StockProcess {
  private isSaleable: boolean;
  private isSaleAndRepair: boolean;
  private productPurchaseOrder: product_order; //TODO: Prisma.PromiseReturnType<typeof product_order_repository.findOne>
  private productSaleOrders: product_order[]; //TODO: Prisma.PromiseReturnType<typeof product_order_repository.findOne>[]
  
  private locationName: string;
  private typeName: string;
  private firstProductOrder: product_order;
  private theProductOrder: product_order;
  private product_order: ProductOrderPayload;
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
    private readonly product: ProductRelation,
    private readonly productSelect: Prisma.productSelect,
    private readonly orderId?: number,
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
    this.typeName = product_type?.name;
    
    this.firstProductOrder = product_order?.[0];
    this.theProductOrder = product_order.find(po => po.order_id === this.orderId);
    this.product_order = {
      id: this.theProductOrder?.id,
      price: this.theProductOrder?.price,
      quantity: this.theProductOrder?.quantity,
    };
    
    this.aservices = this.theProductOrder?.['aservice'] || [];
    this.orderDate = this.firstProductOrder?.['aorder']?.order_date;
    this.orderNumber = this.firstProductOrder?.['aorder']?.order_nr;
    this.productTypeTasks = product_type?.['product_type_task'] || [];

    this.productPurchaseOrder = product_order.find(po => po['aorder']?.discr == AOrderDiscrimination.PURCHASE);
    this.productSaleOrders = product_order.filter(po => po['aorder']?.discr == AOrderDiscrimination.SALE);

    this.isSaleable = product_status ? product_status?.is_saleable ?? true : false;
    this.isSaleAndRepair = this.productSaleOrders.length == 1 && this.productSaleOrders?.[0]['aorder']?.repair?.id;
  }
  
  public async run(): Promise<ProcessedStock> {
    this.processedTasks = this.processTasks();
    this.quantitySold = await this.getQuantitySold();
    this.quantityPurchased = this.getQuantityPurchased();
    this.quantitySaleable = await this.getQuantitySaleable();
    this.quantityInStock = await this.getQuantityInStock();
    this.quantityOnHold = await this.getQuantityOnHold();
    this.splittable = this.quantityPurchased > 1;

    const result: ProcessedStock = {
      id: this.rest.id,
      sku: this.rest.sku,
      name: this.rest.name,
      price: this.rest.price,
      created_at: this.rest.created_at,
      updated_at: this.rest.updated_at,
      retailPrice: this.firstProductOrder?.price ?? 0,
      location: this.locationName,
      type: this.typeName,
      stock: this.quantityInStock,
      purch: this.quantityPurchased,
      hold: this.quantityOnHold,
      sale: this.quantitySaleable,
      sold: this.quantitySold,
      order_date: this.orderDate,
      order_nr: this.orderNumber,
      tasks: this.processedTasks,
      splittable: this.splittable,
      ...(this.orderId && {product_order: this.product_order}),
      ...(this.orderId && {services: this.aservices}),
    };
    
    return result;
  }

  private processTasks(): ProcessedTask[] {
    return this.productTypeTasks.map(productTypeTask => {
      const processedTask: ProcessedTask = {
        name: productTypeTask['task'].name,
        description: productTypeTask['task'].description,
        status: AServiceStatus.STATUS_TODO,
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
          
          const newProduct = await this.repository.findOneSelect({
            id: product_attributed['product_product_attribute_product_idToproduct'].id,
            select: this.productSelect,
          });

          const newProductProcess = new StockProcess(
            this.repository,
            newProduct,
            this.productSelect,
            this.orderId
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

