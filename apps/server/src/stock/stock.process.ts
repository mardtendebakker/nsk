import { aservice, product, product_order, product_type_task } from "@prisma/client";
import { AttributeType } from "../attribute/enum/attribute-type.enum";
import { AOrderDiscrimination } from "../aorder/types/aorder-discrimination.enum";
import { AServiceStatus } from "../aservice/enum/aservice-status.enum";
import { ProductRelation } from "./types/product-relation";
import { ProcessedTask } from "./dto/processed-task.dto";
import { ProcessedStock } from "./dto/processed-stock.dto";
import { ProductOrderPayload } from "./types/product-order-payload";
import { ProductOrderRelationOrder } from "./dto/product-order-relation-order.dto";
import { EntityStatus } from "../common/types/entity-status.enum";

export class StockProcess {
  private isSaleable: boolean;
  private isSaleAndRepair: boolean;
  private productPurchaseOrder: product_order; //TODO: Prisma.PromiseReturnType<typeof product_order_repository.findOne>
  private productSaleOrders: product_order[]; //TODO: Prisma.PromiseReturnType<typeof product_order_repository.findOne>[]
  
  private locationName: string;
  private status: string;
  private entity: string;
  private typeName: string;
  private firstProductOrder: product_order;
  private theProductOrder: product_order;
  private product_orders: ProductOrderRelationOrder[];
  private product_order: ProductOrderPayload;
  private aservices: aservice[];
  private orderDate: Date;
  private orderNumber: string;
  private productTypeTasks: product_type_task[];
  private rest: Partial<product>;

  private attributedProducts: Pick<product, 'price'>[];
  private processedTasks: ProcessedTask[];
  private quantitySold: number = null;
  private quantityPurchased: number = null;
  private quantitySaleable: number = null;
  private quantityInStock: number = null;
  private quantityOnHold: number = null;
  private splittable: boolean;

  constructor(
    private readonly product: ProductRelation,
    private readonly orderId?: number,
  ) {
    this.init();
  }

  private init() {
    const {
      product_order,
      product_type,
      product_status,
      entity_status,
      location,
      product_attribute_product_attribute_product_idToproduct: _,
      ...rest
    } = this.product;

    this.rest = rest;
    this.locationName = location?.name;
    this.status = product_status?.name;
    this.entity = Object.keys(EntityStatus).find(key => EntityStatus[key] === entity_status);
    this.typeName = product_type?.name;
    
    this.product_orders = product_order.map(pOrder => ({
      id: pOrder.id,
      order: {
        id: pOrder?.['aorder']?.id,
        order_nr: pOrder?.['aorder']?.order_nr,
        order_date: pOrder?.['aorder']?.order_date,
        discr: pOrder?.['aorder']?.discr,
        status: pOrder?.['aorder']?.order_status?.name,
      },
      price: pOrder.price,
      quantity: pOrder.quantity ?? 1,
    }));
    this.firstProductOrder = product_order?.[0];
    this.theProductOrder = product_order.find(po => po.order_id === this.orderId);
    this.product_order = {
      id: this.theProductOrder?.id,
      price: this.theProductOrder?.price,
      quantity: this.theProductOrder?.quantity ?? 1,
    };
    
    this.aservices =
      this.theProductOrder?.['aservice'] ||
      this.firstProductOrder?.['aservice'] ||
      [];
    this.orderDate = this.firstProductOrder?.['aorder']?.order_date;
    this.orderNumber = this.firstProductOrder?.['aorder']?.order_nr;
    this.productTypeTasks = product_type?.['product_type_task'] || [];

    this.productPurchaseOrder = product_order.find(po => po['aorder']?.discr == AOrderDiscrimination.PURCHASE);
    this.productSaleOrders = product_order.filter(po => po['aorder']?.discr == AOrderDiscrimination.SALE);

    this.isSaleable = product_status ? product_status?.is_saleable ?? true : false;
    this.isSaleAndRepair = this.productSaleOrders.length == 1 && this.productSaleOrders?.[0]['aorder']?.repair?.id;
  }
  
  public run(): ProcessedStock {
    this.processedTasks = this.processTasks();
    this.attributedProducts = this.getAttributedProducts();
    this.quantitySold = this.getQuantitySold();
    this.quantityPurchased = this.getQuantityPurchased();
    this.quantitySaleable = this.getQuantitySaleable();
    this.quantityInStock = this.getQuantityInStock();
    this.quantityOnHold = this.getQuantityOnHold();
    this.splittable = this.quantityPurchased > 1;

    const result: ProcessedStock = {
      id: this.rest.id,
      sku: this.rest.sku,
      name: this.rest.name,
      price: this.rest.price,
      status: this.status,
      entity: this.entity,
      created_at: this.rest.created_at,
      updated_at: this.rest.updated_at,
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
      attributedProducts: this.attributedProducts,
      product_orders: this.product_orders,
      ...(this.orderId && {product_order: this.product_order}),
      ...(this.orderId && {services: this.aservices}),
    };
    
    return result;
  }

  private getAttributedProducts() {
    const { product_attribute_product_attribute_product_idToproduct: product_attributes } = this.product;
    const attributed_products = [];
    for (const product_attribute of product_attributes) {
      if (product_attribute['attribute'].type == AttributeType.TYPE_PRODUCT &&
        product_attribute['product_product_attribute_value_product_idToproduct']) {
        attributed_products.push(
          product_attribute[
            'product_product_attribute_value_product_idToproduct'
          ],
        );
      }
    }
    return attributed_products;
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

  private getQuantitySold() {
    let quantitySold = 0;

    if (this.isSaleable) {
      quantitySold += this.productSaleOrders.reduce((acc, cur) => acc + cur.quantity, 0);
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

  private getQuantitySaleable() {
    let quantitySaleable = 0;

    if (this.isSaleable) {
      quantitySaleable = this.getQuantityPurchased();
    }

    this.quantitySaleable = quantitySaleable - this.quantitySold ?? this.getQuantitySold();
    return this.quantitySaleable;
  }

  private getQuantityInStock() {
    const isStock = this.product?.product_status?.is_stock;
    const quantitySold = this.quantitySold ?? this.getQuantitySold();
    let quantityInStock = 0;

    if (isStock) {
      if (this.productPurchaseOrder) {
        quantityInStock = this.productPurchaseOrder?.quantity ?? 1;
      } else if (this.isSaleAndRepair) {
        quantityInStock = this.productSaleOrders?.[0]?.quantity ?? 1;
      }
    }

    this.quantityInStock = quantityInStock - quantitySold;
    return this.quantityInStock;
  }

  private getQuantityOnHold() {
    const quantityInStock = this.quantityInStock ?? this.getQuantityInStock();
    const quantitySaleable = this.quantitySaleable ?? this.getQuantitySaleable();

    this.quantityOnHold = quantityInStock - quantitySaleable > 0 ? quantityInStock - quantitySaleable : 0;
    return this.quantityOnHold;
  }
}

