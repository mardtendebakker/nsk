export type OrderType = 'purchase' | 'sales' | 'repair';
export type OrderPrint = {
  onClick: () => void,
  transKey: 'normal' | 'export',
};
