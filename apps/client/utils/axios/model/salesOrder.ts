export default interface SalesOrder {
  id?: number,
  order_nr?: string
  remarks?: string,
  order_date: string,
  discount?: number,
  transport?: number,
  is_gift?: boolean,
  delivery_instructions?: string
  /* 'external_id': 0,
  'delivery_type': 0,
  'delivery_date': {},
  'afile': {},
  'acompany_aorder_supplier_idToacompany': {},
  'aorder': {},
  'other_aorder': {},
  'order_status': {},
  'acompany_aorder_customer_idToacompany': {},
  'pickup': {},
  'product_order': {},
  'repair': {} */
}
