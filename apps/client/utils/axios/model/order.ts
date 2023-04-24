interface Company {
  id: string,
  name: string,
  acompany?: { id: string, name: string }
}

export default interface PurchaseOrder {
  id?: number,
  order_nr?: string
  remarks?: string,
  order_date: string,
  discount?: number,
  transport?: number,
  is_gift?: boolean,
  delivery_instructions?: string
  order_status: { name: string, color: string }
  acompany_aorder_supplier_idToacompany?: Company,
  acompany_aorder_customer_idToacompany?: Company,
  /* 'external_id': 0,
  'delivery_type': 0,
  'delivery_date': {},
  'afile': {},
  'aorder': {},
  'other_aorder': {},
  'order_status': {},
  'pickup': {},
  'product_order': {},
  'repair': {} */
}
