
import { Prisma, product, product_order } from "@prisma/client";
import { AttributeType } from "../attribute/enum/attribute-type.enum";
import { OrderDiscrimination } from "../order/types/order-discrimination.enum";
import { ProductRepository } from "./product.repository";

export class ProductProcess {
  private isSaleable: boolean;
  private isSaleAndRepair: boolean;
  private productPurchaseOrder: product_order; //TODO: Prisma.PromiseReturnType<typeof product_order_repository.findOne>
  private productSaleOrders: product_order[]; //TODO: Prisma.PromiseReturnType<typeof product_order_repository.findOne>[]
  
  private locationName: string;
  private aserviceDone: number;
  private taskCount: number;
  private rest: Partial<product>;
  private splittable: boolean;

  private attributedQuantity: number = null;
  private quantitySold: number = null;
  private quantityPurchased: number = null;
  private quantitySaleable: number = null;
  private quantityInStock: number = null;
  private quantityOnHold: number = null;

  constructor(
    private readonly repository: ProductRepository,
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
      ...rest
    } = this.product;

    this.rest = rest;
    this.locationName = location?.name;
    this.aserviceDone = product_order?.[0]?.['aservice']?.length;
    this.taskCount = product_type?.['_count']?.product_type_task;

    this.productPurchaseOrder = product_order.find(po => po['aorder']?.discr == OrderDiscrimination.PURCHASE);
    this.productSaleOrders = product_order.filter(po => po['aorder']?.discr == OrderDiscrimination.SALE);
    
    this.isSaleable = product_status ? product_status?.is_saleable ?? true : false;
    this.isSaleAndRepair = this.productSaleOrders.length == 1 && this.productSaleOrders?.[0]['aorder']?.repair?.id;
  }
  
  public async run() {
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
      done: this.aserviceDone,
      tasks: this.taskCount,
      splittable: this.splittable,
    };
  }

  private getAttributedQuantity() {
    const { product_attribute_product_attribute_value_product_idToproduct } = this.product;
    const product_attributed = product_attribute_product_attribute_value_product_idToproduct[0];
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
    const { product_attribute_product_attribute_value_product_idToproduct } = this.product;
    const product_attributeds = product_attribute_product_attribute_value_product_idToproduct;
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

          const newProductProcess = new ProductProcess(
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

    quantityPurchased = this.productPurchaseOrder?.quantity ?? 1;

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
