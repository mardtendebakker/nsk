import { Injectable } from '@nestjs/common';
import { LocationLabelRepository } from './location-label.repository';
import { CreateLocationLabelDto } from './dto/create-location-label.dto';
import { LocationTemplateService } from '../admin/location-template/location-template.service';

@Injectable()
export class LocationLabelService {
  constructor(
    private readonly repository: LocationLabelRepository,
    private readonly locationTemplateService: LocationTemplateService
  ) {}

  async create(createLocationLabelDto: CreateLocationLabelDto) {
    await this.locationTemplateService.validate(createLocationLabelDto);

    return this.repository.create({
      data: createLocationLabelDto,
    });
  }

  async findByLabelOrCreate(createLocationLabelDto: CreateLocationLabelDto) {
    let locationLabel = await this.repository.findFirst({
      where: { label: createLocationLabelDto.label }
    });

    if (!locationLabel) {
      locationLabel = await this.create(createLocationLabelDto);
    }

    return locationLabel;
  }
}
