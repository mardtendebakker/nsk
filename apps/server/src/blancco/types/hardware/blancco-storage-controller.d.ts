import { BlanccoUnknownField } from "../blancco-unknown-field";

export type BlanccoStorageController = BlanccoUnknownField & {
  vendor?: string;
  model?: string;
  type?: string;
  driver?: string;
  index?: string;
  vendor_id?: string;
  model_id?: string;
  subvendor_id?: string;
  subdevice_id?: string;
  subvendor_name?: string;
  class_id?: string;
  subclass_id?: string;
  interface_id?: string;
};
