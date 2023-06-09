import { Injectable } from '@nestjs/common';
import { PickupRepository } from './pickup.repository';
import { FindManyDto } from './dto/find-many.dto';

@Injectable()
export class PickupService {
  constructor(protected readonly repository: PickupRepository) {}

  findAll(query: FindManyDto) {
    return this.repository.findAll({
      ...query,
      select: {
        id: true,
        data_destruction: true,
        origin: true,
        pickup_date: true,
        real_pickup_date: true,
        aorder: true,
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
  }
}
