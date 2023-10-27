import { PartialType } from "@nestjs/swagger";
import { CreateLocationTemplateDto } from "./create-location-template.dto";

export class UpdateLocationTemplateDto extends PartialType(CreateLocationTemplateDto) {}
