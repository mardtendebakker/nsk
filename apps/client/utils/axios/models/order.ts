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
  contact: SubContact,
  vat: {
    value: number,
    label: string,
    code: number
  }
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

export interface Team {
  id: number,
  name: string,
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
  totalPriceExtVat: number,
  vatValue: number,
  contact_aorder_customer_idTocontact:Contact,
  contact_aorder_supplier_idTocontact:Contact
  totalPerProductType: object
  vat_rate: number
}

interface Pickup {
  id:number,
  afile:AFile[],
  driver_id:number,
  vehicle_id:number,
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
  afile:AFile[],
  date?:string,
  type?:number,
  instructions?:string,
  dhl_tracking_code?: string,
  vehicle_id?: number,
  driver_id?: number,
}
