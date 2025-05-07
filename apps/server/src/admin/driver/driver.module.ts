import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { DriverController } from './driver.controller';
import { UserRepository } from '../../user/user.repository';

@Module({
  providers: [DriverService, UserRepository],
  exports: [DriverService],
  controllers: [DriverController],
  imports: [PrismaModule],
})
export class DriverAdminModule {}
