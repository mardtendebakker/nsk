import { Group } from './group';

export type ModuleName = 'blancco' | 'customer_contact_action' | 'logistics' | 'attributes' | 'tasks' | 'product_statuses' | 'order_statuses' | 'tracking';

export interface Module {
  name: ModuleName;
  active: boolean;
  price: number;
  activeAt?: string;
  expiresAt?: string;
}

export interface User {
  username: string,
  email: string,
  groups: Group[],
  accessToken?: string,
  refreshToken?: string,
  emailVerified: boolean,
  modules: Module[]
}
