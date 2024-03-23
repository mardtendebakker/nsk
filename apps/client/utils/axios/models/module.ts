export interface ModuleListItem {
  id: number;
  name: string;
  active: boolean;
  price: number;
  freeTrialUsed: boolean;
  config: { [key: string]: { value: string, sensitive?: boolean, required?: boolean } };
  activeAt?: string;
  expiresAt?: string;
}
