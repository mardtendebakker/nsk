/* eslint-disable @typescript-eslint/naming-convention */
import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as crypto from 'node:crypto';
import bcrypt = require('bcrypt');
import { FindManyDto } from './dto/find-many.dto';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UserRepository } from '../../user/user.repository';
import { Group } from '../../user/model/group.enum';

@Injectable()
export class DriverService {
  constructor(
    private repository: UserRepository,
  ) {}

  findAll(query: FindManyDto) {
    const where: Prisma.userWhereInput = { groups: { contains: Group.LOGISTICS } };

    if (query.search) {
      where.OR = [
        { first_name: { contains: query.search } },
        { last_name: { contains: query.search } },
        { email: { contains: query.search } },
        { username: { contains: query.search } },
      ];
    }

    return this.repository.findAll({ ...query, where });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id, groups: { contains: Group.LOGISTICS } } });
  }

  delete(id: number) { return this.repository.delete({ where: { id } }); }

  async update(id: number, { first_name, last_name }: UpdateDriverDto) {
    return this.repository.update({ where: { id }, data: { first_name, last_name } });
  }

  async create(body: CreateDriverDto) {
    try {
      return await this.repository.create({
        data: {
          ...body,
          groups: JSON.stringify([Group.LOGISTICS.toString()]),
          refresh_token: crypto.randomBytes(20).toString('hex'),
          password: bcrypt.hashSync(Math.random().toString(), 12),
        },
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  handleError(error: Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002' && error?.message?.includes('username')) {
      throw new ConflictException('Username already exist');
    } else if (error.code === 'P2002' && error?.message?.includes('email')) {
      throw new ConflictException('Email already exist');
    }

    throw error;
  }
}
