import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AttributeService } from './attribute.service';
import { AttributeRepository } from './attribute.repository';
import { AttributeController } from './attribute.controller';

@Module({
  providers: [AttributeService, AttributeRepository],
  controllers: [AttributeController],
  imports: [PrismaModule]
})
export class AttributeModule {}
