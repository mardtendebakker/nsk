import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { SplitDto } from './dto/split.dto';
import { CreateBodyStockDto } from '../stock/dto/create-body-stock.dto';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { ProductOrderCreateDto } from '../stock/dto/product-order-create.dto';
import { ProductAttributeDto } from '../stock/dto/product-attribute.dto';
import { AttributeType } from '../attribute/enum/attribute-type.enum';
import { FILE_VALUE_DELIMITER } from '../stock/types/file-value-delimiter.const';
import { FileService } from '../file/file.service';
import { ProductAttributeFile } from '../stock/types/product-attribute-file';
import { ProductOrderUpdateDto } from '../stock/dto/product-order-update.dto';

@Injectable()
export class SplitProductService {
  constructor(
    private readonly productService: ProductService,
    private readonly fileService: FileService
  ) {}

  async splitPartOfBundle(id: number, splitDto: SplitDto) {
    const { quantity, status, newSku } = splitDto;
    const individualize = false;

    return this.splitStock({
      id,
      individualize,
      quantity,
      status,
      newSku,
    });
  }

  async individualizePartOfBundle(id: number, splitDto: SplitDto) {
    const { quantity, status, newSku } = splitDto;
    const individualize = true;

    return this.splitStock({
      id,
      individualize,
      quantity,
      status,
      newSku,
    });
  }

  async individualizeTheWholeStock(id: number, splitDto: SplitDto) {
    const { status, newSku } = splitDto;
    const product = await this.productService.findOneRelation(id);
    const processedProduct = await this.productService.processStock(product);

    const quantity = processedProduct.stock - 1;
    const individualize = true;

    return this.splitStock({
      id,
      individualize,
      quantity,
      status,
      newSku,
    });
  }

  async individualizeTheWholeBundle(id: number, splitDto: SplitDto) {
    const { status, newSku } = splitDto;
    const product = await this.productService.findOneRelation(id);
    const processedProduct = await this.productService.processStock(product);

    const quantity = processedProduct.purch - 1;
    const individualize = true;
    const sales = true;

    return this.splitStock({
      id,
      individualize,
      quantity,
      status,
      newSku,
      sales,
    });
  }

  private async splitStock(params: {
    id: number;
    individualize: boolean;
    quantity?: number;
    status?: number;
    newSku?: boolean;
    sales?: boolean;
  }) {
    const { id, status, individualize, quantity, sales, newSku } = params;
    const product = await this.productService.findOneRelation(id);
    if (sales) {
      let i = 1;
      for (const productOrder of product.product_order) {
        if (productOrder['aorder'].discr === AOrderDiscrimination.SALE) {
          const productOrderQuantity = productOrder.quantity ?? 0;
          for (let k = 0; k < productOrderQuantity; k++) {
            let newSkuIndex: number;
            if (newSku) {
              newSkuIndex = i - 1;
            }
            await this.splitToProduct({
              id,
              nameSupplement: `(split ${i})`,
              quantity: 1,
              newSkuIndex,
              status,
              sales: true,
            });
            i++;
          }
        }
      }

      for (let k = i; k <= quantity; k++) {
        let newSkuIndex: number;
        if (newSku) {
          newSkuIndex = i - 1;
        }
        await this.splitToProduct({
          id,
          nameSupplement: `(split ${k})`,
          quantity: 1,
          newSkuIndex,
          status,
        });
      }
    } else if (individualize && quantity > 1) {
      for (let i = 1; i <= quantity; i++) {
        let newSkuIndex: number;
        if (newSku) {
          newSkuIndex = i - 1;
        }
        await this.splitToProduct({
          id,
          nameSupplement: `(split ${i})`,
          quantity: 1,
          newSkuIndex,
          status,
        });
      }
    } else {
      let newSkuIndex: number;
      if (newSku) {
        newSkuIndex = 0;
      }
      await this.splitToProduct({
        id,
        nameSupplement: `(split)`,
        quantity: Number.isFinite(quantity) ? quantity : 1,
        newSkuIndex,
        status,
      });
    }

    return true;
  }

  private async splitToProduct(params: {
    id: number;
    nameSupplement: string;
    quantity: number;
    newSkuIndex: number;
    status?: number;
    sales?: boolean;
  }) {
    const { id, nameSupplement, quantity, newSkuIndex, status, sales } = params;
    const product = await this.productService.findOneRelation(id);
    const purchaseRelation = product.product_order.find(
      (productOrder) =>
        productOrder['aorder'].discr === AOrderDiscrimination.PURCHASE
    );
    const salesRelation = product.product_order.find(
      (productOrder) =>
        productOrder['aorder'].discr === AOrderDiscrimination.SALE
    );
    const productAttributes =
      product.product_attribute_product_attribute_product_idToproduct;

    const product_orders: ProductOrderCreateDto[] = [];
    if (quantity > 1 && sales) {
      throw new Error('Bundle split with sales order involved is not allowed');
    } else if (sales) {
      product_orders.push({
        order_id: salesRelation.order_id,
        quantity: 1,
        ...(salesRelation?.price && { price: salesRelation.price }),
      });
    }
    product_orders.push({
      order_id: purchaseRelation.order_id,
      quantity,
      ...(purchaseRelation?.price && { price: purchaseRelation.price }),
    });

    const product_attributes: ProductAttributeDto[] = [];
    const files: ProductAttributeFile[] = [];
    for (const productAttribute of productAttributes) {
      const isFile =
        productAttribute?.['attribute']?.type === AttributeType.TYPE_FILE;

      if (isFile) {
        const fileIds =
          productAttribute?.value?.split(FILE_VALUE_DELIMITER).map(Number) ||
          [];

        for (const fileId of fileIds) {
          const result = await this.fileService.get(fileId);
          result &&
            files.push({
              buffer: Buffer.from(await result.Body.transformToByteArray()),
              fieldname: String(productAttribute.attribute_id),
              mimetype: result.ContentType,
            });
        }
      }
      product_attributes.push({
        attribute_id: productAttribute.attribute_id,
        ...(productAttribute.value_product_id && { quantity: 0 }),
        ...(productAttribute.value_product_id && {
          value_product_id: productAttribute.value_product_id,
        }),
        ...(productAttribute.value &&
          !isFile && { value: productAttribute.value }),
        external_id: null,
      });
    }

    const createStockDto: CreateBodyStockDto = {
      sku: Number.isFinite(newSkuIndex)
        ? String(Math.floor(Date.now() / 1000) + newSkuIndex)
        : product.sku,
      name: product.name + ' ' + nameSupplement,
      ...(product.product_type?.id && { type_id: product.product_type.id }),
      ...(product.location?.id && { location_id: product.location.id }),
      ...(product.product_status?.id && { status_id: product.product_status?.id }),
      ...(Number.isFinite(status) && { status_id: status }),
      ...(Number.isFinite(product.price) && { price: product.price }),
      ...(product.description && { description: product.description }),
      ...(product.acompany?.id && { owner_id: product.acompany.id }),
      product_orders,
      product_attributes,
    };

    const productOrderUpdate: ProductOrderUpdateDto[] = [
      {
        id: purchaseRelation.id,
        quantity: purchaseRelation.quantity - quantity,
      },
    ];
    sales &&
      productOrderUpdate.push({
        id: salesRelation.id,
        quantity: salesRelation.quantity - quantity,
      });

    const newProduct = await this.productService.create(createStockDto, files);
    await this.productService.updateOne(product.id, {
      product_orders: productOrderUpdate,
    });

    return newProduct;
  }
}
