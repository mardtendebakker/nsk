import { PartialType } from "@nestjs/swagger";
import { CreateLogisticInputDto } from "./create-logistic.dto";

export class UpdateLogisticInputDto extends PartialType(CreateLogisticInputDto) {}
