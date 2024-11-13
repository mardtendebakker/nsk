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
    private readonly fileService: FileService,
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
    const processedProduct = this.productService.processStock(product);

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
    const processedProduct = this.productService.processStock(product);

    const quantity = processedProduct.purch - 1;
    const individualize = true;

    return this.splitStock({
      id,
      individualize,
      quantity,
      status,
      newSku,
    });
  }

  private async splitStock(params: {
    id: number;
    individualize: boolean;
    quantity?: number;
    status?: number;
    newSku?: boolean;
  }) {
    const {
      id, status, individualize, quantity, newSku,
    } = params;

    if (individualize && quantity > 1) {
      for (let i = 1; i <= quantity; i += 1) {
        let newSkuIndex: number;
        if (newSku) {
          newSkuIndex = i - 1;
        }
        // eslint-disable-next-line no-await-in-loop
        await this.splitToProduct({
          id,
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
        quantity: Number.isFinite(quantity) ? quantity : 1,
        newSkuIndex,
        status,
      });
    }

    return true;
  }

  private async splitToProduct(params: {
    id: number;
    quantity: number;
    newSkuIndex: number;
    status?: number;
  }) {
    const {
      id, quantity, newSkuIndex, status,
    } = params;
    const product = await this.productService.findOneRelation(id);

    const salesRelation = product.product_order.find(
      (productOrder) => productOrder.aorder.discr === AOrderDiscrimination.SALE,
    );
    if (salesRelation) {
      throw new Error('Bundle split with sales order involved is not allowed');
    }

    const purchaseRelation = product.product_order.find(
      (productOrder) => productOrder.aorder.discr === AOrderDiscrimination.PURCHASE,
    );
    const productAttributes = product.product_attribute_product_attribute_product_idToproduct;

    const productOrders: ProductOrderCreateDto[] = [];
    productOrders.push({
      order_id: purchaseRelation.order_id,
      quantity,
      ...(purchaseRelation?.price && { price: purchaseRelation.price }),
    });

    const productAttributesDto: ProductAttributeDto[] = [];
    const files: ProductAttributeFile[] = [];
    productAttributes.forEach((productAttribute) => {
      const isFile = productAttribute?.attribute?.type === AttributeType.TYPE_FILE;

      if (isFile) {
        const fileIds = productAttribute?.value?.split(FILE_VALUE_DELIMITER)
          .filter((n) => !Number.isNaN(Number(n)) && n.trim() !== '')
          .map(Number) || [];

        fileIds.forEach(async (fileId) => {
          try {
            const result = await this.fileService.get(fileId);
            if (result) {
              files.push({
                buffer: Buffer.from(await result.Body.transformToByteArray()),
                fieldname: String(productAttribute.attribute_id),
                mimetype: result.ContentType,
              });
            }
          } catch (e) { /* empty */ }
        });
      }
      productAttributesDto.push({
        attribute_id: productAttribute.attribute_id,
        ...(productAttribute.value_product_id && { quantity: 0 }),
        ...(productAttribute.value_product_id && {
          value_product_id: productAttribute.value_product_id,
        }),
        ...(productAttribute.value
          && !isFile && { value: productAttribute.value }),
        external_id: null,
      });
    });

    const newStockDto: CreateBodyStockDto = {
      sku: Number.isFinite(newSkuIndex)
        ? String(Math.floor(Date.now() / 1000) + newSkuIndex)
        : product.sku,
      name: product.name,
      location_id: product.location?.id,
      ...(product.location_label?.id && { location_label_id: product.location_label.id }),
      ...(product.product_type?.id && { type_id: product.product_type.id }),
      ...(product.product_status?.id && { status_id: product.product_status?.id }),
      ...(Number.isFinite(status) && { status_id: status }),
      ...(Number.isFinite(product.price) && { price: product.price }),
      ...(Number.isFinite(product.entity_status) && { entity_status: product.entity_status }),
      ...(product.description && { description: product.description }),
      product_orders: productOrders,
      product_attributes: productAttributesDto,
    };

    const productOrderUpdate: ProductOrderUpdateDto[] = [
      {
        id: purchaseRelation.id,
        quantity: purchaseRelation.quantity - quantity,
      },
    ];

    const newProduct = await this.productService.create(newStockDto, files);
    await this.productService.updateOne(id, {
      product_orders: productOrderUpdate,
    });

    return newProduct;
  }
}
