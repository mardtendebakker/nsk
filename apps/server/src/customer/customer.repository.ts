import { Injectable } from '@nestjs/common';
import { ContactRepository } from '../contact/contact.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomerRepository extends ContactRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService
  ) {
    super(prisma, configService);
  }
}
