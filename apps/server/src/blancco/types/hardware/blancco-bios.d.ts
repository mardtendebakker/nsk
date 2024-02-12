import { BlanccoUnknownField } from "../blancco-unknown-field";

export type BlanccoBios = BlanccoUnknownField & {
  vendor?: string;
  version?: string;
  date?: string;
  rom_size?: number;
};
