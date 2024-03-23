import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ModuleName } from '../moduleName.type';

type Config = { [key: string]: { value: string, sensitive?: boolean, required?: boolean } };

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
