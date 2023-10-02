import { OrderType } from '../models/types';
import { AUTOCOMPLETE_PURCHASE_STATUSES_PATH, AUTOCOMPLETE_REPAIR_STATUSES_PATH, AUTOCOMPLETE_SALE_STATUSES_PATH } from '../paths';

const AUTOCOMPLETE_ORDER_STATUSES = {
  purchase: AUTOCOMPLETE_PURCHASE_STATUSES_PATH,
  sales: AUTOCOMPLETE_SALE_STATUSES_PATH,
  repair: AUTOCOMPLETE_REPAIR_STATUSES_PATH,
};

export function autocompleteOrderStatusesPathMapper(type: OrderType) {
  return AUTOCOMPLETE_ORDER_STATUSES[type];
}
// TODO: move other type mapper here like AJAX_PATHS
