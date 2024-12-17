import { AFile } from './aFile';

interface Order {
  id: number,
  discr: 'p' | 's',
  contact: string,
  company: string,
  order_date: string,
  order_nr: string,
  status: string
}

export interface LocationTemplate {
  id: number,
  template: string,
}

export interface Product {
  id: number,
  name:string,
  price:number,
  sku:string,
  location:{ id: number, name: string, location_template: LocationTemplate[] },
  location_label:{ id: number, label: string },
  product_orders: { quantity: number, order: Order }[],
  product_status:{ id: number, name: string },
  product_type:{ id: number, name: string },
  description:string,
  updated_at:string,
  created_at:string,
  product_attributes:{
    quantity: number,
    value: string,
    attribute_id: number,
    totalStandardPrice: number,
    attribute: { type: number },
    selectedOption: { price: number }
  }[],
  afile:AFile[]
}

export interface ProductStatus {
  id:number,
  name:string,
  is_stock:boolean,
  is_saleable:boolean,
  color:string,
}

export interface Service {
  id:number,
  description:number,
  price:number,
  status:number,
}

export interface ProductOrder {
  id:number,
  price:number,
  quantity: number
}

export interface ProductListItem {
  id: number,
  name:string,
  price:number,
  sku:string,
  order_date:string,
  order_nr:string,
  purch:number,
  sale:number,
  sold:number,
  splittable:boolean,
  stock:number,
  location:string,
  type:string,
  product_order:ProductOrder,
  tasks:Task[],
  services:Service[],
  updated_at:string,
  created_at:string
}

export interface Task {
  id:number,
  name:string,
  description:string,
  status:number,
  productTypes:ProductType[]
}

export interface AttributeOption {
  id:number,
  name:string,
  price:number
}

export interface Attribute {
  id:number,
  name:string,
  type:number,
  magento_attr_code: string,
  attr_code:number,
  is_public:boolean,
  product_type_id:number,
  price:number,
  options:AttributeOption[],
  productTypes:ProductType[]
}

export interface ProductType {
  id:number,
  name:string,
  pindex: number,
  comment:string,
  magento_category_id:string,
  magento_attr_set_id: string,
  is_attribute: boolean,
  is_public: boolean,
  attributes:Attribute[]
  tasks:Task[]
}
