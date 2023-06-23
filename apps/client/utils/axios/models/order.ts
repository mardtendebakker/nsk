export interface Company {
  id?: string,
  name?: string,
  acompany?: { id?: string, name?: string }
}

export interface OrderStatus {
  id: number,
  name?: string,
  is_sale?: boolean,
  is_purchase?: boolean,
  color?: string,
  mailbody?: string
}

export interface OrderListItem {
  id?: number,
  order_nr?: string
  order_date?: string,
  order_status?: { id: number, name?: string, color?: string }
  acompany_aorder_supplier_idToacompany?: Company,
  acompany_aorder_customer_idToacompany?: Company
}

export interface Order {
  id?: number,
  order_nr?: string
  remarks?: string,
  order_date?: string,
  pickup_date?: string,
  discount?: number,
  transport?: number,
  is_gift?: boolean,
  order_status?: { id:number, name?: string, color?: string }
  status_id?: number,
  supplier_id?: number,
  customer_id?: number,
  pickup?: Pickup,
  delivery_date?: string,
  delivery_type?: number,
  delivery_instructions?: string,
}

interface Pickup {
  id?: number,
  logistics_id?: number,
  pickup_date?: string,
  real_pickup_date?: string,
  description?: string,
  origin?: string,
  dataDestruction?: number,
  agreement?: { id?: number, originalClientFilename?: string },
  images?: { originalClientFilename?: string }[]
}
