import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VehicleRepository {
  constructor(
    private readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {}

  getAll() {
    return this.prisma.vehicle.findMany();
  }

  create(data: Prisma.vehicleCreateInput) {
    return this.prisma.vehicle.create({
      data,
    });
  }

  findOne(params: Prisma.vehicleFindFirstArgs) {
    return this.prisma.vehicle.findFirst(params);
  }

  async delete(params: Prisma.vehicleDeleteArgs) {
    try {
      return await this.prisma.vehicle.delete(params);
    } catch (err) {
      if (err.code === 'P2003') {
        throw new ConflictException();
      }

      throw err;
    }
  }

  update(params: {
    where: Prisma.vehicleWhereUniqueInput;
    data: Prisma.vehicleUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.vehicle.update({
      data,
      where,
    });
  }

  async findAll(params: Prisma.vehicleFindManyArgs) {
    const {
      skip, cursor, where, select, orderBy,
    } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take < maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.vehicle.count({ where }),
      this.prisma.vehicle.findMany({
        skip, take, cursor, where, select, orderBy,
      }),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
}
