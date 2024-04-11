import { BlanccoUnknownField } from '../blancco-unknown-field';

export type BlanccoVideoCard = BlanccoUnknownField & {
  id?: number;
  vendor?: string;
  model?: string;
  driver?: string;
  video_memory?: number;
  memory_type?: string;
  vendor_id?: string;
  model_id?: string;
  subvendor_id?: string;
  subdevice_id?: string;
  subvendor_name?: string;
  class_id?: string;
  subclass_id?: string;
  interface_id?: string;
};
