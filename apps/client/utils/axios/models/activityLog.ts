export interface ActivityLog {
  id: number;
  username?: string;
  method?: string;
  route?: string;
  params?: string;
  body?: string;
  query?: string;
  before?: string;
  model?: string;
  action?: string;
  bulk: boolean;
  createdAt: string;
  updated_at: string;
}
