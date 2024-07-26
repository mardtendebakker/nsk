import { HttpException, HttpStatus } from '@nestjs/common';
import { BlanccoService } from '../blancco/blancco.service';
import { BlanccoReportsV1 } from '../blancco/types/blancco-reports-v1';
import { StockRepository } from './stock.repository';
import { ProductAttributeDto } from './dto/product-attribute.dto';
import { AttributeIncludeOption } from './types/attribute-include-option';
import { BlanccoReportV1 } from '../blancco/types/blancco-report-v1';
import { BlanccoCustomFiledKeys } from '../blancco/types/blancco-custom-field-keys.enum';
import { BlanccoProductTypes } from '../blancco/types/blancco-product-types.enum';
import { StockService } from './stock.service';
import { BlanccoHardwareKeys } from '../blancco/types/blancco-hardware-keys.enum';

export class StockBlancco {
  constructor(
    protected readonly repository: StockRepository,
    protected readonly stockService: StockService,
    protected readonly blanccoService: BlanccoService,
  ) {}

  async importFromBlancco(orderId: number): Promise<number> {
    let results: boolean[] = [];
    let newCursor: string | null = null;

    try {
      do {
        const { cursor, ...reports } = await this.blanccoService.getReports(orderId, newCursor);
        const result = await this.handleBlanccoReoprts(orderId, reports);
        results = results.concat(result);

        newCursor = cursor;
      } while (newCursor);
    } catch (err) {
      const httpStatus = err instanceof HttpException
        ? err.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
      if (httpStatus !== HttpStatus.NOT_FOUND) {
        throw err;
      }
    }

    return results.length;
  }

  private async handleBlanccoReoprts(
    orderId: number,
    reports: BlanccoReportsV1,
  ): Promise<boolean[]> {
    const results: boolean[] = [];

    for (const uuid in reports) {
      let result = false;
      try {
        result = await this.createProductAttributeByBlanccoReport(orderId, reports[uuid].report);
      } catch (err) {
        console.log('handleBlanccoReoprts:', err);
        continue;
      }
      results.push(result);
    }

    return results;
  }

  private async createProductAttributeByBlanccoReport(orderId: number, report: BlanccoReportV1): Promise<boolean> {
    const sku = this.blanccoService.getValueFromReportByKey(report, BlanccoCustomFiledKeys.SKU_NUMBER);
    if (!sku) {
      console.log(`createProductAttributeByBlanccoReport, No sku found! sku: ${sku}`);
      return false;
    }

    const productTypeName = this.getProductTypeName(report);
    if (!productTypeName) {
      console.log(`createProductAttributeByBlanccoReport, No productTypeName found! sku: ${sku}`);
      return false;
    }

    const productType = await this.repository.getProductTypeByName(productTypeName);
    const attributes = await this.repository.getAttributesByProductTypeId(productType.id);

    const product_attributes = await this.prepareProductAttributesByBlanccoReport(report, attributes);

    const products = await this.repository.findBy({ where: { sku, product_order: { some: { order_id: orderId } } } });
    if (!products.length) {
      console.log(`createProductAttributeByBlanccoReport, No products found! sku: ${sku}`);
      return false;
    }
    for (const product of products) {
      this.repository.deleteProductAttributes(product.id);
      this.stockService.updateOne(product.id, {
        type_id: productType.id,
        product_attributes,
      });
    }

    return true;
  }

  private getProductTypeName(report: BlanccoReportV1): string {
    let productTypeName = this.blanccoService
      .getValueFromReportByKey(report, BlanccoCustomFiledKeys.PRODUCT_TYPE);

    // TODO: must move to database, admin should customize them
    if (!productTypeName) {
      const chassisType = this.blanccoService
        .getValueFromReportByKey(report, BlanccoHardwareKeys.CHASSIS_TYPE);
      if (['Desktop', 'Low Profile Desktop', 'Mini Tower'].includes(chassisType)) {
        productTypeName = BlanccoProductTypes.COMPUTER;
      } else if (['Laptop', 'Notebook', 'Convertible', 'Portable'].includes(chassisType)) {
        productTypeName = BlanccoProductTypes.LAPTOP;
      } else if (['Server', 'Rack Mount Chassis', 'Main Server Chassis', 'Tower'].includes(chassisType)) {
        productTypeName = BlanccoProductTypes.SERVER;
      } else if (['Mobile Device'].includes(chassisType)) {
        productTypeName = BlanccoProductTypes.TELEFOON_TABLET;
      }
    }

    return productTypeName;
  }

  private async prepareProductAttributesByBlanccoReport(
    report: BlanccoReportV1,
    attributes: AttributeIncludeOption[],
  ): Promise<ProductAttributeDto[]> {
    const productAttributes: ProductAttributeDto[] = [];

    for (const attribute of attributes) {
      const reportValue = this.blanccoService.getValueFromReportByKey(report.blancco_data.blancco_hardware_report, attribute.attr_code);
      if (reportValue) {
        const formattedValue = this.blanccoService.formatNumberWithScale(reportValue);
        productAttributes.push(await this.stockService.preapareProductAttributeByStringValue(attribute, formattedValue));
      }
    }

    return productAttributes;
  }
}
