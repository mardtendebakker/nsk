import { Customer } from './customer.reponse.dto';

export class Order {
  id: string;

  customer: Customer;

  transport?: number;

  products: { id: string, nexxusId?: string, quantity: number }[];
}
