import { PartialType } from '@nestjs/swagger';
import { CreatePickupUncheckedWithoutAorderInputDto } from './create-pickup-unchecked-without-aorder-input.dto';

export class UpdatePickupInputDto extends PartialType(CreatePickupUncheckedWithoutAorderInputDto) {}
