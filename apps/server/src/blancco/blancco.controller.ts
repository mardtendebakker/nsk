import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorization } from '@nestjs-cognito/auth';
import { ADMINS_GROUPS } from '../common/types/cognito-groups.enum';
import { BlanccoService } from './blancco.service';

@ApiBearerAuth()
@Authorization(ADMINS_GROUPS)
@ApiTags('blancco')
@Controller('blancco')
export class BlanccoController {
  constructor(protected readonly blanccoService: BlanccoService) {}

  @Post('init')
  create() {
    return this.blanccoService.init();
  }
}
