import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LocationTemplateRepository } from './location-template.repository';
import { FindManyDto } from './dto/find-many.dto';
import { CreateLocationTemplateDto } from './dto/create-location-template.dto';
import { UpdateLocationTemplateDto } from './dto/update-location-template.dto';
import { CreateLocationLabelDto } from '../../location-label/dto/create-location-label.dto';

@Injectable()
export class LocationTemplateService {
  constructor(protected readonly repository: LocationTemplateRepository) {}

  async findAll(query: FindManyDto) {
    const { location, search } = query;
    return this.repository.findAll({
      ...query,
      where: {
        ...query.where,
        ...(location && { location_id: location }),
        ...(search && { name: { contains: search } }),
      },
      orderBy: Object.keys(query?.orderBy || {})?.length ? query.orderBy : { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const params: Prisma.location_templateFindUniqueArgs = {
      where: { id },
    };

    return this.repository.findOne(params);
  }

  async create(createLocationTemplateDto: CreateLocationTemplateDto) {
    return this.repository.create({
      data: createLocationTemplateDto,
    });
  }

  async update(id: number, updateLocationTemplateDto: UpdateLocationTemplateDto) {
    return this.repository.update({
      where: { id },
      data: { ...updateLocationTemplateDto },
    });
  }

  async delete(id: number) {
    return this.repository.delete({
      where: { id },
    });
  }

  async validate(createLocationLabelDto: CreateLocationLabelDto) {
    const locationTemplates = await this.findAll({
      location: createLocationLabelDto.location_id,
    });

    if (locationTemplates.data.length == 0) {
      return true;
    }

    for (const locationTemplate of locationTemplates.data) {
      if (new RegExp(locationTemplate.template).test(createLocationLabelDto.label)) {
        return true;
      }
    }

    throw new UnprocessableEntityException(`Invalid label: ${createLocationLabelDto.label}`);
  }
}
