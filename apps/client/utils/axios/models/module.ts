export interface ModuleListItem {
  id: number;
  name: string;
  active: boolean;
  price: number;
  freeTrialUsed: boolean;
  config: { [key: string]: {
    value?: string | string[],
    required?: boolean,
    type: 'string' | 'hour' | 'multiSelect' | 'password',
    options?: string[]
  } };
  activeAt?: string;
  expiresAt?: string;
}
