import { BlanccoUnknownField } from "../blancco-unknown-field";

export type BlanccoSoundCard = BlanccoUnknownField & {
  vendor?: string;
  model?: string;
  vendor_id?: string;
  model_id?: string;
  subvendor_id?: string;
  subdevice_id?: string;
  subvendor_name?: string;
  class_id?: string;
  subclass_id?: string;
  interface_id?: string;
};
