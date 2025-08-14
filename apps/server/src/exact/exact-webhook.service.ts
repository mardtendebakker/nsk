import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ExactService } from './exact.service';
import { SaleRepository } from '../sale/sale.repository';
import { OrderStatusService } from '../admin/order-status/order-status.service';
import { OrderPaymentWebhookDto } from './dto/order-payment-webhook.dto';

@Injectable()
export class ExactWebhookService {
  constructor(
    private readonly exactService: ExactService,
    private readonly saleRepository: SaleRepository,
    private readonly orderStatusService: OrderStatusService
  ) {}

  async handleOrderPayment(body: OrderPaymentWebhookDto) {
    if (body.paymentStatus !== 'paid') {
      return;
    }

    const orders = (await this.saleRepository.findBy({
      where: { exact_invoice_id: body.invoiceId },
      include: {
        contact_aorder_customer_idTocontact: {
          include: {
            company_contact_company_idTocompany: true,
          },
        },
        product_order: {
          include: {
            product: true,
          },
        },
      },
    })) as any;

    const orderWithDetails = orders[0];

    if (!orderWithDetails) {
      throw new NotFoundException('Order not found');
    }

    const customer = orderWithDetails.contact_aorder_customer_idTocontact;

    if (!customer || !customer.email) {
      throw new UnprocessableEntityException('Customer email not found');
    }

    const paidStatuses = await this.orderStatusService.findBy({
      where: { name: 'Bestelling betaald', is_sale: true },
    });

    const paidStatus = paidStatuses[0];

    await this.saleRepository.update({
      where: { id: orderWithDetails.id },
      data: { status_id: paidStatus.id },
    });

    if (orderWithDetails.exact_invoice_id) {
      const pdfUrl = await this.exactService.getInvoicePdfUrl(
        orderWithDetails.exact_invoice_id
      );

      await this.saleRepository.update({
        where: { id: orderWithDetails.id },
        data: { exact_invoice_pdf: pdfUrl },
      });
    }
  }
}
