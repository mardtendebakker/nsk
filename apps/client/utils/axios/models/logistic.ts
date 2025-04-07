export interface Vehicle {
  id: number,
  name: string,
  registration_number: string,
}

export interface Driver {
  id: number,
  username: string,
  first_name: string
  last_name: string
  email: string
}

export interface LogisticServiceListItem {
  id: number,
  event_date:string,
  event_title:string,
  order:Order,
  vehicle?:Vehicle,
  driver?: Driver,
}

export interface Supplier {
  city:string,
  country:string,
  state:string,
  zip:string,
  street:string,
  phone:string,
  company_name:string,
  email:string,
  name:string
}

export type Customer = Supplier;

export interface OrderStatus {
  color:string,
}

export interface Order {
  id:number,
  order_nr:string,
  order_status:OrderStatus,
  supplier:Supplier,
  customer:Customer,
}
