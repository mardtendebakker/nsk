import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '../types/status';

class Module {
  @ApiProperty()
    id: number;

  @ApiProperty()
    name: string;

  @ApiProperty()
    price: number;

  @ApiProperty()
    activeAt: Date;

  @ApiProperty()
    expiresAt: Date;
}

export class FindPaymentResponseDto {
  @ApiProperty()
    id: number;

  @ApiPropertyOptional()
    method: string;

  @ApiProperty()
    transactionId: string;

  @ApiProperty()
    subscriptionId: string;

  @ApiProperty()
    status: Status;

  @ApiProperty()
    amount: number;

  @ApiProperty()
    createdAt: Date;

  @ApiProperty()
    updatedAt: Date;

  @ApiProperty()
    modules: Module[];
}
