import { OmitType } from "@nestjs/swagger";
import { CreateServiceDto } from "./create-service.dto";

export class UpdateServiceDto extends OmitType(CreateServiceDto, ['product_order_id', 'task_id']) {}
