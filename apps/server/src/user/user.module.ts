import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from './user.repository';

@Module({
  providers: [UserService, PrismaService, UserRepository],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
