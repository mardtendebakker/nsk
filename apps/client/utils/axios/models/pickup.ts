export interface PickupListItem {
  id?: number,
  real_pickup_date?: string,
  order?: Order,
  logistic?: Logistic,
}

export interface OrderStatus {
  color?: string,
}

export interface Logistic {
  id?: number,
  username?: string
}

export interface Order {
  id?: number,
  order_nr?: string,
  order_status?: OrderStatus,
  products: Product[]
}

export interface Product {
  id?: number,
  name?: string
}
