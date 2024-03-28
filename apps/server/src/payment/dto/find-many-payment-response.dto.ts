import { ApiProperty } from '@nestjs/swagger';
import { FindPaymentResponseDto } from './find-payment-response.dto';

export class FindManyPaymentResponseDto {
  @ApiProperty()
    count: number;

  @ApiProperty()
    data: FindPaymentResponseDto[];
}
