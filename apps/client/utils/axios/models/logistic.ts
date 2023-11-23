export interface LogisticServiceListItem {
  id: number,
  event_date:string,
  event_title:string,
  order:Order,
  logistic:Logistic,
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

export interface Logistic {
  id:number,
  username:string,
  firstname:string,
  lastname:string,
  email:string,
}

export interface Order {
  id:number,
  order_nr:string,
  order_status:OrderStatus,
  supplier:Supplier,
  customer:Customer,
}
