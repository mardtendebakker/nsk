export interface Company {
  id?: string,
  name?: string,
  acompany?: { id?: string, name?: string }
}

export interface OrderListItem {
  id?: number,
  order_nr?: string
  order_date?: string,
  order_status?: { id:number, name?: string, color?: string }
  acompany_aorder_supplier_idToacompany?: Company,
  acompany_aorder_customer_idToacompany?: Company
}

export interface Order {
  id?: number,
  order_nr?: string
  remarks?: string,
  order_date?: string,
  discount?: number,
  transport?: number,
  is_gift?: boolean,
  order_status?: { id:number, name?: string, color?: string }
  status_id?: number,
  supplier_id?: number,
}
