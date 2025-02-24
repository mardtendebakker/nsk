export type VatCode = {
  code: number,
  label: string,
  value: number,
};

export const VAT_CODES: VatCode[] = [
  { code: 2, label: '21%', value: 21 },
  { code: 5, label: 'BTW verlegd', value: 0 },
  { code: 6, label: 'No BTW', value: 0 },
];
