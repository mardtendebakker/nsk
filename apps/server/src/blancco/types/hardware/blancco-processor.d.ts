import { BlanccoUnknownField } from '../blancco-unknown-field';

export type BlanccoProcessor = BlanccoUnknownField & {
  total_cores?: number;
  total_cpus?: number;
  test?: string;
};
