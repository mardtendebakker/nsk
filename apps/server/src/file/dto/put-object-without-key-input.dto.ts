import { OmitType } from '@nestjs/swagger';
import { PutObjectInput } from './put-object-input.dto';

export class PutObjectWithoutKeyInput extends OmitType(PutObjectInput, [
  'Key',
] as const) {}
