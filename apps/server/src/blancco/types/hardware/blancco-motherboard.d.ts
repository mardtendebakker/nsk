import { BlanccoUnknownField } from '../blancco-unknown-field';

export type BlanccoMotherboard = BlanccoUnknownField & {
  vendor?: string;
  product_name?: string;
  version?: string;
  serial_number?: string;
  test?: string;
};
