import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../company/company.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomerRepository extends CompanyRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService
  ) {
    super(prisma, configService);
  }
}
