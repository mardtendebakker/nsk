import { BlanccoUnknownField } from "../blancco-unknown-field";

export type BlanccoSystem = BlanccoUnknownField & {
  manufacturer?: string;
  model?: string;
  serial?: string;
  uuid?: string;
  chassis_type?: string;
  asset_tag?: string;
  sku_number?: string;
  bios_mode?: string;
  secure_boot_state?: string;
};
