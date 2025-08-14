import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OrderPaymentWebhookDto {
  @ApiProperty({
    description: 'The Exact invoice ID',
    example: '12345',
  })
  @IsString()
  invoiceId: string;

  @ApiProperty({
    description: 'The payment status of the order',
    example: 'paid',
  })
  @IsString()
  paymentStatus: string;
}
