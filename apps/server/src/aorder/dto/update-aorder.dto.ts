import { PartialType } from '@nestjs/swagger';
import { CreateAOrderDto } from './create-aorder.dto';

export class UpdateAOrderDto extends PartialType(CreateAOrderDto) {}
