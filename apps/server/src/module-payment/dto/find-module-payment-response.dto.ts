import { ApiProperty } from '@nestjs/swagger';
import { ModuleName } from '../../module/moduleName.type';
import { Status } from '../status.type';

export class FindModulePaymentResponseDto {
  @ApiProperty()
    id: number;

  @ApiProperty()
    moduleName: ModuleName;

  @ApiProperty()
    method: string;

  @ApiProperty()
    transactionId: string;

  @ApiProperty()
    price: number;

  @ApiProperty()
    status: Status;

  @ApiProperty()
    active: boolean;

  @ApiProperty()
    activeAt: Date;

  @ApiProperty()
    expiresAt: Date;
}
