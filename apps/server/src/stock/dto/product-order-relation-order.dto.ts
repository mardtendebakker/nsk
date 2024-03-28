import { AOrderSummaryDto } from '../../aorder/dto/aorder-summary.dro';

export class ProductOrderRelationOrder {
  id: number;

  order: AOrderSummaryDto;

  quantity: number;

  price: number;
}
