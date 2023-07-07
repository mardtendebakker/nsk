import { Injectable } from '@nestjs/common';
import { PickupRepository } from './pickup.repository';
import { FindManyDto } from './dto/find-many.dto';

@Injectable()
export class PickupService {
  constructor(protected readonly repository: PickupRepository) {}

  async findAll(query: FindManyDto) {
    //TODO get correct data type
    const {count, data} : {count: number, data: any[]} = await this.repository.findAll({
      ...query,
      select: {
        id: true,
        data_destruction: true,
        origin: true,
        real_pickup_date: true,
        aorder: {
          select : {
            id: true,
            order_nr: true,
            order_status: true,
            acompany_aorder_customer_idToacompany: true,
            acompany_aorder_supplier_idToacompany: true,
            product_order: {
              select: {
                id: true,
                product: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        },
        fos_user: true,
      },
      where: {
        real_pickup_date: {
          gte: query.startsAt,
          lte: query.endsAt,
        }
      },
      skip: query.skip,
      take: query.take,
    });

    return {
      count,
      data: data.map(({
        aorder: {
          product_order,
          acompany_aorder_customer_idToacompany,
          acompany_aorder_supplier_idToacompany,
          ...order
        },
        fos_user,
        ...rest
      })=> ({
          ...rest,
          order: {
            ...order,
            products: product_order.map((element) => Object.values(element)[1]),
            customer: acompany_aorder_customer_idToacompany, 
            supplier: acompany_aorder_supplier_idToacompany, 
          },
          logistic: fos_user,
      }))
    }
  }
}
