export interface ModuleListItem {
  name: string;
  active: boolean;
  price: number;
  freeTrialUsed: boolean;
  activeAt?: string;
  expiresAt?: string;
}
