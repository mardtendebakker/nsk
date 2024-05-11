import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AProductRepository } from '../aproduct.repository';

@Injectable()
export class WebshopProductRepository extends AProductRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {
    super(prisma, configService);
  }
}
