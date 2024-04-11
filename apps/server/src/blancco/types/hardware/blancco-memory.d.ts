import { BlanccoUnknownField } from '../blancco-unknown-field';

export type BlanccoMemory = BlanccoUnknownField & {
  total_memory?: number;
  accessible_memory?: number;
  physical_memory?: number;
  total_slots?: number;
  free_slots?: number;
  test?: string;
};
