export interface OrderStatus {
  id: number;
  name: string;
  color: string;
}

export interface AorderLog {
  id: number;
  username: string;
  previous_status_id: number;
  status_id: number;
  previous_status: OrderStatus;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}
