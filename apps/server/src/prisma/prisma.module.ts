import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaService } from './prisma.service';
import { UserRouteInterceptor } from '../common/interceptor/user-route.interceptor';

@Module({
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserRouteInterceptor,
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
