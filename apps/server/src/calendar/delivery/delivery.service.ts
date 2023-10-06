import { Injectable } from '@nestjs/common';
import { DeliveryRepository } from './delivery.repository';
import { FindManyDto } from '../dto/find-many.dto';
import { AOrderDiscrimination } from '../../aorder/types/aorder-discrimination.enum';
import { FindDeliveriesResponeDto } from './dto/find-delivery-response.dto';
import { FindCalendarResponeDto } from '../dto/find-calendar-response.dto';

@Injectable()
export class DeliveryService {
  constructor(protected readonly repository: DeliveryRepository) {}

  async findAll(query: FindManyDto): Promise<FindDeliveriesResponeDto> {
    //TODO get correct data type
    const { count, data }: { count: number; data: any[] } =
      await this.repository.findAll({
        ...query,
        select: {
          id: true,
          order_nr: true,
          order_status: true,
          delivery_date: true,
          acompany_aorder_customer_idToacompany: true,
          product_order: {
            select: {
              id: true,
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        where: {
          discr: AOrderDiscrimination.SALE,
          delivery_date: {
            gte: query.startsAt,
            lte: query.endsAt,
          },
        },
        skip: query.skip,
        take: query.take,
      });

    const deliveriesDto: FindCalendarResponeDto[] = data.map(
      ({
        id,
        order_nr,
        delivery_date,
        order_status,
        product_order,
        acompany_aorder_customer_idToacompany,
      }) => ({
        id,
        event_date: delivery_date,
        event_title: product_order.map(({ product }) => product)?.[0]?.name,
        order: {
          id,
          order_nr,
          order_status,
          customer: acompany_aorder_customer_idToacompany,
        },
        logistic: null,
      })
    );

    return {
      count,
      data: deliveriesDto,
    };
  }
}
