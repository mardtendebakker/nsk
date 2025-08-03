import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {}

  async findAll(params: Prisma.contactFindManyArgs) {
    const {
      skip, cursor, select, orderBy, where,
    } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take < maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.contact.count({ where }),
      this.prisma.contact.findMany({
        skip, take, cursor, where, select, orderBy,
      }),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  count(params: Prisma.contactFindManyArgs) {
    const { where } = params;

    return this.prisma.contact.count({ where });
  }

  create(contactCreateInput: Prisma.contactCreateInput) {
    return this.prisma.contact.create({
      data: contactCreateInput,
    });
  }

  findOne(params: Prisma.contactFindUniqueArgs) {
    return this.prisma.contact.findUnique(params);
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

  delete(params: { where: Prisma.contactWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.contact.delete({ where });
  }

  getMainContact(id: number) {
    return this.prisma.contact.findFirst({
      where: {
        is_main: true,
        NOT: { id },
        company_contact_company_idTocompany: {
          companyContacts: {
            some: { id },
          },
        },
      },
    });
  }
}
