import { PickType } from "@nestjs/swagger";
import { AcompanyEntity } from "../entities/acompany.entity";

export class FindAcompanyResponeDto extends PickType(AcompanyEntity, [
  "id",
  "name",
  "representative",
  "email",
  "partner_id",
] as const) {}
