export interface BaseCustomer {
  id?: number,
  name?: string,
  representative?: string,
  email?: string,
  phone?: string,
  phone2?: string,
  street?: string,
  street_extra?: string,
  city?: string,
  country?: string,
  state?: string,
  zip?: string,
  street2?: string,
  street_extra2?: string,
  city2?: string,
  country2?: string,
  state2?: string,
  zip2?: string,
}

export interface Customer extends BaseCustomer {
  kvk_nr?: string,
  is_partner?: number,
}

export interface Company {
  id: string,
  name: string,
  acompany?: { id: string, name: string }
}

export interface Order {
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
  acompany_aorder_customer_idToacompany?: Company
}

export interface AttributeOption {
  id: number,
  name: string,
  price: number
}

export interface Attribute {
  id?: number,
  name: string,
  type: number,
  options: AttributeOption[]
}

export interface ProductType {
  id?: number,
  name: string,
  attributes: Attribute[]
}

export interface Task {
  name: string,
  description: string,
  status: number
}

export interface Product {
  id?: number,
  hold: number,
  location: string,
  name: string,
  order_date: string,
  order_nr: string,
  price: number,
  purch: number,
  sale: number,
  sku: string,
  sold: number,
  splittable: boolean,
  stock: number,
  tasks: Task[],
  updated_at: string
}

export interface Supplier extends BaseCustomer {
  partner?: string,
}

export interface User {
  id?: string,
}
