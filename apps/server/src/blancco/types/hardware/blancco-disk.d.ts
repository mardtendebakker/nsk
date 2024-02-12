import { BlanccoUnknownField } from "../blancco-unknown-field";

export type BlanccoDisk = BlanccoUnknownField & {
  id?: number;
  internal_id?: number;
  index?: string;
  model?: string;
  vendor?: string;
  serial?: string;
  wwnid?: string;
  firmware_revision?: string;
  blocksize?: number;
  interface_type?: string;
  average_write_speed?: number;
  average_read_speed?: number;
  capacity?: number;
  sectors?: number;
  remapped_sectors?: number;
  health?: string;
};
