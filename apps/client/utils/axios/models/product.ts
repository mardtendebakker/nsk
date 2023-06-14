export interface Product {
  id: number,
  name?: string,
  price?: number,
  sku?: string,
  location?: { id: number, name: string },
  product_order?: { id: number, name: string },
  product_status?: { id: number, name: string },
  product_type?: { id: number, name: string },
  description?: string,
  updated_at?: string,
  created_at?: string,
  product_attributes?: { quantity?: number, value: string, attribute_id: number, attribute: { type: number } }[],
  afile?: AFile[]
}

export interface ProductListItem {
  id: number,
  name?: string,
  price?: number,
  retailPrice?: number,
  sku?: string,
  order_date?: string,
  order_nr?: string,
  purch?: number,
  sale?: number,
  sold?: number,
  splittable?: boolean,
  stock?: number,
  location?: string,
  type?: string,
  tasks?: Task[],
  updated_at?: string,
  created_at?: string
}

export interface Task {
  id?: string,
  name?: string,
  description?: string,
  status?: number,
  productTypes?: ProductType[]
}

export interface AttributeOption {
  id?: number,
  name?: string,
  price?: number
}

export interface Attribute {
  id?: number,
  name?: string,
  type?: number,
  attr_code?: number,
  options?: AttributeOption[],
}

export interface ProductType {
  id?: number,
  name?: string,
  comment?: string,
  attributes?: Attribute[]
  tasks?: Task[]
}

export interface AFile {
  id?: number,
  unique_server_filename?: string,
  original_client_filename?: string,
  discr?: string
}
