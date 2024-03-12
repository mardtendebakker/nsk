import { BlanccoUnknownField } from "../blancco-unknown-field";

export type BlanccoUsbDevice = BlanccoUnknownField & {
  id?: number;
  vendor?: string;
  device_name?: string;
  manufacturer?: string;
  product_name?: string;
  version?: string;
  vendor_id?: string;
  model_id?: string;
  class_id?: string;
};
