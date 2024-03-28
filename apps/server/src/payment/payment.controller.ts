import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { FindPaymentResponseDto } from './dto/find-payment-response.dto';
import { FindManyDto } from './dto/find-many.dto';
import { MollieWebhookDto } from './dto/mollie-webhook.dto';
import { SetupDto } from './dto/setup.dto';
import { ModuleName } from '../module/module.service';

@ApiBearerAuth()
@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(
    protected readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  @Get('')
  @ApiResponse({ type: FindPaymentResponseDto, isArray: true })
  findAll(@Query() query: FindManyDto) {
    return this.paymentService.findAll(query);
  }

  @Post('/setup')
  async setup(@Body() body: SetupDto) {
    const { _links: { checkout: { href } } } = await this.paymentService.setup(body);

    return href;
  }

  @Post('/mollie-webhook')
  async mollieWebhook(@Body() body: MollieWebhookDto, @Query() query) {
    const apiKey = this.configService.get<string>('MOLLIE_WEBHOOK_API_KEY');

    if (!apiKey || query.apiKey != this.configService.get<string>('MOLLIE_WEBHOOK_API_KEY')) {
      throw new UnauthorizedException('Invalid api key');
    }

    await this.paymentService.updateMollieTransaction(body.id);

    return '';
  }

  @Post('/:id/subscription')
  async createMollieSubscription(@Param('id') id: number) {
    await this.paymentService.createMollieSubscription(id);

    return '';
  }

  @Delete('/:id/subscription')
  async deleteMollieSubscription(@Param('id') id: number) {
    await this.paymentService.deleteMollieSubscription(id);

    return '';
  }

  @Patch('/free-trial/:moduleName')
  freeTrial(@Param('moduleName') moduleName: ModuleName) {
    return this.paymentService.freeTrial(moduleName);
  }
}
