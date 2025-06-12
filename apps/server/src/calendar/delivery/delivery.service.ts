import { Injectable } from '@nestjs/common';
import { DeliveryRepository } from './delivery.repository';
import { FindManyDto } from '../dto/find-many.dto';
import { FindDeliveriesResponeDto } from './dto/find-delivery-response.dto';
import { FindCalendarResponeDto } from '../dto/find-calendar-response.dto';

@Injectable()
export class DeliveryService {
  constructor(protected readonly repository: DeliveryRepository) {}

  async findAll(query: FindManyDto): Promise<FindDeliveriesResponeDto> {
    // TODO get correct data type
    const { count, data }: { count: number; data: any[] } = await this.repository.findAll({
      ...query,
      select: {
        id: true,
        date: true,
        aorder: {
          select: {
            id: true,
            order_nr: true,
            order_status: true,
            contact_aorder_customer_idTocontact: {
              select: {
                name: true,
                email: true,
                city: true,
                country: true,
                state: true,
                zip: true,
                street: true,
                phone: true,
                company_contact_company_idTocompany: true,
              },
            },
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
        },
        driver: {
          select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            name: true,
            registration_number: true,
          },
        },
      },
      where: {
        date: {
          gte: query.startsAt,
          lte: query.endsAt,
        },
        ...(query.licensePlate ? {
          vehicle: {
            registration_number: {
              equals: query.licensePlate,
            },
          },
        } : undefined),
      },
      skip: query.skip,
      take: query.take,
    });

    const deliveriesDto: FindCalendarResponeDto[] = data.map(
      ({
        aorder: {
          id,
          order_nr,
          order_status,
          product_order,
          contact_aorder_customer_idTocontact: {
            company_contact_company_idTocompany: company_customer,
            ...rest_customer
          },
        },
        date,
        ...deliveryRest
      }) => ({
        ...deliveryRest,
        event_date: date,
        event_title: product_order.map(({ product }) => product)?.[0]?.name,
        order: {
          id,
          order_nr,
          order_status,
          customer: {
            ...rest_customer,
            company_name: company_customer.name,
          },
        },
      }),
    );

    return {
      count,
      data: deliveriesDto,
    };
  }
}
