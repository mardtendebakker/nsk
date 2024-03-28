import { BlanccoReportV1 } from './blancco-report-v1';
import { BlanccoUnknownField } from './blancco-unknown-field';

export type BlanccoReportsV1 = {
  [key: string]: (BlanccoUnknownField | string) & {
    report?: BlanccoReportV1;
  };
};
