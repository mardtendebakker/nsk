export type TaxCode = {
  code: number,
  label: string,
  value: number,
};

export const TAX_CODES: TaxCode[] = [
  { code: 2, label: '21%', value: 21 },
  { code: 5, label: 'BTW verlegd', value: 0 },
  { code: 6, label: 'No BTW', value: 0 },
];
