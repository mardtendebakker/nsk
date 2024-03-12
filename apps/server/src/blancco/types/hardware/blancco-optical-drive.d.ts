import { BlanccoUnknownField } from "../blancco-unknown-field";

export type BlanccoOpticalDrive = BlanccoUnknownField & {
  id?: number;
  vendor?: string;
  model?: string;
  type?: string;
};
