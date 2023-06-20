import { Injectable } from '@nestjs/common';
import { FindManyDto } from './dto/find-many.dto';
import { LogisticRepository } from './logistic.repository';
import { FindLogisticResponeDto, FindLogisticsResponeDto } from './dto/find-logistic-response.dto';

@Injectable()
export class LogisticService {
  constructor(private readonly repository: LogisticRepository) {}
  async findAll(query: FindManyDto): Promise<FindLogisticsResponeDto> {
    const { count, data } = await this.repository.findAll(query);
    const result: FindLogisticsResponeDto = {
      data: data.map(((logistic): FindLogisticResponeDto => (
        {
          id: logistic.id,
          username: logistic.username,
        }
      ))),
      count,
    };

    return result;
  }

  async findOne(id: number): Promise<FindLogisticResponeDto> {
    const logistic = await this.repository.findOne({ where: { id } });

    return {
      id: logistic.id,
      username: logistic.username,
    };
  }
}
