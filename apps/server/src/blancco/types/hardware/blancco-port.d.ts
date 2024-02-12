import { BlanccoUnknownField } from "../blancco-unknown-field";

export type BlanccoPort = BlanccoUnknownField & {
  external_name?: string;
  internal_name?: string;
  type?: string;
  connector_type?: string;
};
