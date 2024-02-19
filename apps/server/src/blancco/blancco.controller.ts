import { Controller, Post } from '@nestjs/common';
import { ADMINS_GROUPS } from '../common/types/cognito-groups.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorization } from '@nestjs-cognito/auth';
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
