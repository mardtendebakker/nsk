export interface PickupListItem {
  id: number,
  logistic_date:string,
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
  name:string,
  email:string,
  representative:string
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
  products:Product[],
  supplier:Supplier,
  customer:Customer,
}

export interface Product {
  id:number,
  name:string
}
