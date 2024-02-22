import { ModulePayment } from './modulePayment';

export interface PaymentListItem {
  id: number;
  method?: string;
  transactionId: string;
  subscriptionId?: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  modules: ModulePayment[]
}
