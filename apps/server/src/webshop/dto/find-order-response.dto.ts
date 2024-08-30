import { Customer } from './customer.reponse.dto';

export class Order {
  id: string;

  customer: Customer;

  transport?: number;

  products: { nexxus_id?: string, quantity: number }[];
}
