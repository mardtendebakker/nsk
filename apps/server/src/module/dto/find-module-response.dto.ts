import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ModuleName } from '../moduleName.type';

export type Type = 'string' | 'hour' | 'multiSelect' | 'password';

type Config = { [key: string]: {
  value: string | string[],
  required?: boolean,
  type: Type,
  options?: string[]
} };

export class FindModuleResponseDto {
  @ApiProperty()
    id: number;

  @ApiProperty()
    name: ModuleName;

  @ApiProperty()
    price: number;

  @ApiPropertyOptional()
    activeAt: Date;

  @ApiPropertyOptional()
    expiresAt: Date;

  @ApiProperty()
    active: boolean;

  @ApiProperty()
    freeTrialUsed: boolean;

  @ApiPropertyOptional()
    config?: Config;
}
