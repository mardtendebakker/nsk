import { AFile } from './aFile';

interface ProductOrder {
  quantity: number,
  product: { name: string }
}

export interface Company {
  id:string,
  name:string,
  city?: string,
  street?: string,
  zip?: string,
  acompany:{ id:string, name:string }
}

export interface OrderStatus {
  id: number,
  name:string,
  is_sale:boolean,
  is_purchase:boolean,
  color:string,
  mailbody:string
}

export interface OrderListItem {
  id: number,
  order_nr:string
  order_date:string,
  order_status: { id: number, name:string, color:string }
  product_orders: ProductOrder[];
  acompany_aorder_supplier_idToacompany:Company,
  acompany_aorder_customer_idToacompany:Company
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
  pickup:Pickup,
  delivery_date:string,
  delivery_type:number,
  delivery_instructions:string,
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
