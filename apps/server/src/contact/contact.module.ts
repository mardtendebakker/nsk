import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ContactRepository } from './contact.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [
    ContactService,
    {
      provide: 'TYPE',
      useValue: undefined,
    },
    ContactRepository,
  ],
  controllers: [ContactController],
  imports: [PrismaModule],
})
export class ContactModule {}
