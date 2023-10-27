import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocationTemplateRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService
  ) {}

  async findAll(params: Prisma.location_templateFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take <  maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.location_template.count({where}),
      this.prisma.location_template.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
  
  async findOne(params: Prisma.location_templateFindUniqueArgs) {
    return this.prisma.location_template.findUnique(params);
  }
  
  async findFirst(params: Prisma.location_templateFindFirstArgs) {
    return this.prisma.location_template.findFirst(params);
  }

  async create(params: Prisma.location_templateCreateArgs) {
    try {
      return await this.prisma.location_template.create(params);
    } catch (err) {
      this.handleError(err);
    }
  }

  async update(params: Prisma.location_templateUpdateArgs) {
    try {
      return await this.prisma.location_template.update(params);
    } catch (err) {
      this.handleError(err);
    }
  }

  async delete(params: Prisma.location_templateDeleteArgs) {
    try {
      return await this.prisma.location_template.delete(params);
    } catch (err) {
      this.handleError(err);
    }
  }

  handleError(error: Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictException();
    }
    if (error.code === 'P2003') {
      throw new ConflictException();
    }

    if (error.message.includes('initial should contain only letters')) {
      throw new UnprocessableEntityException('initial should contain only letters');
    }

    throw error;
  }
}
