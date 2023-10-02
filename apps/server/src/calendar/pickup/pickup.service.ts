import { Injectable } from '@nestjs/common';
import { PickupRepository } from './pickup.repository';
import { CreatePickupUncheckedWithoutAorderInputDto } from './dto/create-pickup-unchecked-without-aorder-input.dto';
import { FindManyDto } from '../dto/find-many.dto';
import { FindPickupsResponeDto } from './dto/find-all-pickup-response.dto';
import { FindCalendarResponeDto } from '../dto/find-calendar-response.dto';

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
              acompany_aorder_supplier_idToacompany: true,
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
          fos_user: true,
        },
        where: {
          real_pickup_date: {
            gte: query.startsAt,
            lte: query.endsAt,
          },
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
          acompany_aorder_supplier_idToacompany,
        },
        real_pickup_date,
        fos_user,
        ...prickupRest
      }) => ({
        ...prickupRest,
        logistic_date: real_pickup_date,
        order: { 
          id,
          order_nr,
          order_status,
          products: product_order.map(({ product }) => product),
          supplier: acompany_aorder_supplier_idToacompany,
        },
        logistic: fos_user,
      })
    );

    return {
      count,
      data: pickupsDto,
    };
  }

  async create(pickup: CreatePickupUncheckedWithoutAorderInputDto) {
    return this.repository.create({
      data: pickup,
    });
  }
}
