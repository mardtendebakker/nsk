import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlanccoService } from './blancco.service';
import { ADMINS_GROUPS } from '../user/model/group.enum';
import { Authorization } from '../security/decorator/authorization.decorator';

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
