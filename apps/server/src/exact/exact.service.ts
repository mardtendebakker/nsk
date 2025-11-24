import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

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
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
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

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    token?: string
  ): Promise<T> {
    const url = `${this.baseUrl}/${this.division}${endpoint}`;
    const headers = {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          headers,
          data,
        })
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new UnauthorizedException('INVALID_OR_EXPIRED_EXACT_TOKEN');
      }
      throw error;
    }
  }

  async createSalesInvoice(
    invoiceData: ExactInvoiceRequest,
    { token }: { token: string }
  ): Promise<ExactInvoiceResponse> {
    return this.makeRequest(
      'POST',
      '/salesinvoice/SalesInvoices',
      invoiceData,
      token
    );
  }

  async createCustomer(
    customerData: any,
    { token }: { token: string }
  ): Promise<{ ID: string }> {
    const result = await this.makeRequest<{ ID: string }>(
      'POST',
      '/crm/Accounts',
      customerData,
      token
    );
    return result;
  }

  async createItem(
    itemData: any,
    { token }: { token: string }
  ): Promise<{ ID: string }> {
    return this.makeRequest<{ ID: string }>(
      'POST',
      '/logistics/Items',
      itemData,
      token
    );
  }

  async getInvoicePdfUrl(invoiceId: string): Promise<string> {
    const response = await this.makeRequest<{ Url: string }>(
      'GET',
      `/salesinvoice/SalesInvoices/${invoiceId}/Document`
    );

    return response.Url || '';
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const url = 'https://start.exactonline.nl/api/oauth2/token';
    const data = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await firstValueFrom(
      this.httpService.post(url, data.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    );

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  }
}
