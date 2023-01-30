import { PickType } from "@nestjs/swagger";
import { SuplierEntity as SupplierEntity } from "../entities/supplier.entity";

export class FindSupplierResponeDto extends PickType(SupplierEntity, [
  "id",
  "name",
  "representative",
  "email",
  "partner_id",
] as const) {}
