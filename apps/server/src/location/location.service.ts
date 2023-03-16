import { Injectable } from '@nestjs/common';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService {
  constructor(protected readonly repository: LocationRepository) {}

  getAll() {
    return this.repository.getAll();
  }
}
