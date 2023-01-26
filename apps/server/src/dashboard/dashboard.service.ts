import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IndexSearchDto } from './dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async searchIndex(indexSearchDto: IndexSearchDto) {
    console.log(indexSearchDto);
    return this.prisma.aorder.findMany({
      where: { order_nr: indexSearchDto.orderNumber },
      select: {
        id: true,
        order_nr: true,
        order_date: true,
        acompany_aorder_supplier_idToacompany: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}