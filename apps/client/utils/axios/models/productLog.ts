export interface ProductLog {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  order_nr: string;
  action: 'delete' | 'add' | 'update';
  created_at: string;
  updated_at: string;
}
