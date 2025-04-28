/* eslint-disable @typescript-eslint/naming-convention */
import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { VehicleRepository } from './vehicle.repository';
import { FindManyDto } from './dto/find-many.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    protected readonly repository: VehicleRepository,
    protected readonly prisma: PrismaService,
  ) {}

  getAll() {
    return this.repository.getAll();
  }

  findAll(query: FindManyDto) {
    const where: Prisma.vehicleWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { registration_number: { contains: query.search } },
      ];
    }

    return this.repository.findAll({ ...query, where });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, body: UpdateVehicleDto) {
    const { name, registration_number } = body;
    await this.checkUniqueness(body, id);
    return this.repository.update({ where: { id }, data: { name, registration_number } });
  }

  delete(id: number) { return this.repository.delete({ where: { id } }); }

  async create(body: CreateVehicleDto) {
    const { name, registration_number } = body;
    await this.checkUniqueness(body, undefined);
    return this.repository.create({ name, registration_number });
  }

  async checkUniqueness(body: CreateVehicleDto | UpdateVehicleDto, id: number | undefined) {
    const { name, registration_number } = body;
    if (name) {
      const { data } = await this.repository.findAll({ where: { name, NOT: { id } } });
      if (data.length > 0) {
        throw new ConflictException('Name already exist');
      }
    }

    if (registration_number) {
      const { data } = await this.repository.findAll({ where: { registration_number, NOT: { id } } });
      if (data.length > 0) {
        throw new ConflictException('Registration number already exist');
      }
    }
  }
}
