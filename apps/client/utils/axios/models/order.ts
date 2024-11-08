import { AFile } from './aFile';

interface ProductOrder {
  quantity: number,
  product: { name: string }
}

export interface Contact {
  id:string,
  name:string,
  city?: string,
  street?: string,
  zip?: string,
  company_id:string,
  company_name:string,
  contact: SubContact
}
export interface SubContact {
  id:string,
  name:string,
  city?: string,
  street?: string,
  zip?: string,
  company_id:string,
  company_name:string,
}

export interface OrderStatus {
  id: number,
  name:string,
  is_purchase:boolean,
  is_sale:boolean,
  is_repair:boolean,
  color:string,
  mailbody:string
}

export interface OrderListItem {
  id: number,
  order_nr:string
  order_date:string,
  pickup: { real_pickup_date: string },
  delivery: { date: string },
  order_status: { id: number, name:string, color:string }
  product_orders: ProductOrder[];
  contact_aorder_supplier_idTocontact:Contact,
  contact_aorder_customer_idTocontact:Contact
}

export interface Order {
  id:number,
  order_nr:string
  remarks:string,
  order_date:string,
  pickup_date:string,
  discount:number,
  transport:number,
  is_gift:boolean,
  order_status:{ id:number, name:string, color:string }
  repair:{ damage?:string, description?:string }
  status_id:number,
  supplier_id:number,
  customer_id:number,
  pickup?: Pickup,
  delivery?: Delivery,
  totalPrice: number,
  contact_aorder_customer_idTocontact:Contact,
  contact_aorder_supplier_idTocontact:Contact
  totalPerProductType: object
}

interface Pickup {
  id:number,
  afile:AFile[],
  logistics_id:number,
  pickup_date:string,
  real_pickup_date:string,
  description:string,
  origin:string,
  data_destruction:number,
  agreement:{ id:number, originalClientFilename:string },
  images:{ originalClientFilename:string }[]
}

interface Delivery {
  id:number,
  date?:string,
  type?:number,
  instructions?:string,
  dhl_tracking_code?: string,
  logistics_id?: number,
}
