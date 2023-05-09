interface Task {
  name: string,
  description: string,
  status: number
}

export default interface Product {
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
