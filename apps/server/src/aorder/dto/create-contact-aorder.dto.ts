import { OmitType } from "@nestjs/swagger";
import { CreateContactDto } from "../../contact/dto/create-contact.dto";

export class CreateContactAOrderDto extends OmitType(CreateContactDto, ['partner_id']) {}
