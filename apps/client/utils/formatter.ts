const formatter = new Intl.NumberFormat('nl', {
  style: 'currency',
  currency: 'EUR',
});
const numberFormatter = new Intl.NumberFormat('nl');

export const price = (value: number): string => formatter.format(value);
export const count = (value: number): string => numberFormatter.format(value);
