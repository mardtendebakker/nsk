import { BlanccoReportsV1 } from './blancco-reports-v1';

export type BlanccoV1 = BlanccoReportsV1 & {
  cursor: string | null;
};
