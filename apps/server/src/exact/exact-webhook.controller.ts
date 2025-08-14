import {
  Body,
  Controller,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ExactWebhookService } from './exact-webhook.service';
import { OrderPaymentWebhookDto } from './dto/order-payment-webhook.dto';

@ApiTags('exact-webhooks')
@Controller('exact/webhooks')
export class ExactWebhookController {
  constructor(
    private readonly exactWebhookService: ExactWebhookService,
    private readonly configService: ConfigService
  ) {}

  @Post('/order-payment')
  async handleOrderPayment(
    @Body() body: OrderPaymentWebhookDto,
    @Query('apiKey') apiKey: string
  ) {
    const webhookApiKey = this.configService.get<string>(
      'EXACT_WEBHOOK_API_KEY'
    );
    if (!webhookApiKey || apiKey !== webhookApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    await this.exactWebhookService.handleOrderPayment(body);
  }
}
