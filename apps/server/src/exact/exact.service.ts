import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface ExactInvoiceItem {
  Item: string;
  Quantity: number;
  UnitPrice: number;
  Description?: string;
}

export interface ExactInvoiceRequest {
  Customer: string;
  Description?: string;
  DocumentDate: string;
  InvoiceDate: string;
  InvoiceTo: string;
  OrderDate: string;
  OrderNumber?: string;
  SalesInvoiceLines: ExactInvoiceItem[];
}

export interface ExactInvoiceResponse {
  InvoiceID: string;
  InvoiceNumber: string;
  Created: string;
  Modified: string;
}

@Injectable()
export class ExactService {
  private accessToken: string | null = null;

  private tokenExpiry: Date | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private get baseUrl(): string {
    return this.configService.get<string>('EXACT_BASE_URL');
  }

  private get clientId(): string {
    return this.configService.get<string>('EXACT_CLIENT_ID');
  }

  private get clientSecret(): string {
    return this.configService.get<string>('EXACT_CLIENT_SECRET');
  }

  private get division(): string {
    return this.configService.get<string>('EXACT_DIVISION');
  }

  private async authenticate(): Promise<void> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return;
    }

    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    this.accessToken = credentials;
    this.tokenExpiry = new Date(Date.now() + 3600000);
  }

  private async makeRequest<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any): Promise<T> {
    await this.authenticate();

    const url = `${this.baseUrl}/${this.division}${endpoint}`;
    const headers = {
      Authorization: `Basic ${this.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const response = await firstValueFrom(
      this.httpService.request({
        method,
        url,
        headers,
        data,
      }),
    );

    return response.data;
  }

  async createSalesInvoice(invoiceData: ExactInvoiceRequest): Promise<ExactInvoiceResponse> {
    return this.makeRequest(
      'POST',
      '/salesinvoice/SalesInvoices',
      invoiceData,
    );
  }

  async createCustomer(customerData: any): Promise<{ ID: string }> {
    const result = await this.makeRequest<{ ID: string }>(
      'POST',
      '/crm/Accounts',
      customerData,
    );
    return result;
  }

  async createItem(itemData: any): Promise<{ ID: string }> {
    return this.makeRequest<{ ID: string }>(
      'POST',
      '/logistics/Items',
      itemData,
    );
  }

  async getInvoicePdfUrl(invoiceId: string): Promise<string> {
    const response = await this.makeRequest<{ Url: string }>(
      'GET',
      `/salesinvoice/SalesInvoices/${invoiceId}/Document`,
    );

    return response.Url || '';
  }
}
