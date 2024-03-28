import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ModuleName } from '../module.service';

export class FindModuleResponseDto {
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
}
