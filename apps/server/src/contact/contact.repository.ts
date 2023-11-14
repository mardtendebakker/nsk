import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService
  ) {}

  async findAll(params: Prisma.contactFindManyArgs) {
    const { skip, cursor, select, orderBy, where } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take <  maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.contact.count({where}),
      this.prisma.contact.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
  
  create(contactCreateArgs: Prisma.contactCreateArgs) {
    return this.prisma.contact.create(contactCreateArgs);
  }
  
  findOne(where: Prisma.contactWhereUniqueInput) {
    return this.prisma.contact.findUnique({
      where,
    });
  }

  findFirst(params: Prisma.contactFindFirstArgs) {
    return this.prisma.contact.findFirst(params);
  }
  
  update(params: {
    where: Prisma.contactWhereUniqueInput;
    data: Prisma.contactUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.contact.update({
      data,
      where,
    });
  }

  delete(params: {where: Prisma.contactWhereUniqueInput}) {
    const { where } = params;
    return this.prisma.contact.delete({where});
  }
}
