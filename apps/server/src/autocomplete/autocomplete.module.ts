import { Module } from '@nestjs/common';
import { AutocompleteService } from './autocomplete.service';
import { AutocompleteController } from './autocomplete.controller';
import { AutocompleteRepository } from './autocomplete.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [AutocompleteService, AutocompleteRepository],
  controllers: [AutocompleteController],
  imports: [PrismaModule],
})

export class AutocompleteModule {}
