import { ProductOrderDto } from '../dto/find-aorder-response.dto';
import { AOrderProcessed } from './aorder-processed';

export type AOrderProductProcessed = Omit<
AOrderProcessed,
'product_order'
> & { product_orders: ProductOrderDto[] };
