import { Injectable } from '@nestjs/common';
import { PickupRepository } from './pickup.repository';
import { CreatePickupUncheckedWithoutAorderInputDto } from './dto/create-pickup-unchecked-without-aorder-input.dto';
import { FindManyDto } from '../dto/find-many.dto';
import { FindPickupsResponeDto } from './dto/find-all-pickup-response.dto';
import { FindCalendarResponeDto } from '../dto/find-calendar-response.dto';
import { set } from 'date-fns';

@Injectable()
export class PickupService {
  constructor(protected readonly repository: PickupRepository) {}

  async findAll(query: FindManyDto): Promise<FindPickupsResponeDto> {
    //TODO get correct data type
    const { count, data }: { count: number; data: any[] } =
      await this.repository.findAll({
        ...query,
        select: {
          id: true,
          data_destruction: true,
          origin: true,
          real_pickup_date: true,
          aorder: {
            select: {
              id: true,
              order_nr: true,
              order_status: true,
              contact_aorder_supplier_idTocontact: {
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
                }
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
          fos_user: {
            select: {
              id: true,
              username: true,
              firstname: true,
              lastname: true
            }
          }
        },
        where: {
          real_pickup_date: {
            gte: query.startsAt,
            lte: query.endsAt,
          },
          ...(query.licensePlate ? {
            fos_user: {
              username: {
                equals: query.licensePlate
              }
            }
          }: undefined),
        },
        skip: query.skip,
        take: query.take,
      });

          const pickupsDto: FindCalendarResponeDto[] = data.map(
        ({
          aorder: {
            id,
            order_nr,
            order_status,
            product_order,
            contact_aorder_supplier_idTocontact: {
            company_contact_company_idTocompany: company_supplier,
            ...rest_supplier
          },
          },
          real_pickup_date,
          fos_user,
          ...prickupRest
        }) => ({
          ...prickupRest,
          event_date: real_pickup_date,
          event_title: product_order.map(({ product }) => product)?.[0]?.name,
          order: { 
            id,
            order_nr,
            order_status,
            supplier: {
              ...rest_supplier,
              company_name: company_supplier.name,
            },
          },
          logistic: fos_user,
        })
      );

    return {
      count,
      data: pickupsDto,
    };
  }

  async findTodayPickupsByLicensePlate(licensePlate: string):  Promise<FindCalendarResponeDto[]> {
    const date = new Date();

    const startsAt = set(date, {hours: 0, minutes: 0, seconds: 0});
    const endsAt = set(date, {hours: 23, minutes: 59, seconds: 59});

    const {data} = await this.findAll({skip: 0, take: 50, licensePlate, startsAt, endsAt});

    return data;
  }
  
  async create(pickup: CreatePickupUncheckedWithoutAorderInputDto) {
    return this.repository.create({
      data: pickup,
    });
  }
}
