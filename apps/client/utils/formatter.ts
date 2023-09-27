const formatter = new Intl.NumberFormat('nl', {
  style: 'currency',
  currency: 'EUR',
});

export const price = (value: number): string => formatter.format(value);
