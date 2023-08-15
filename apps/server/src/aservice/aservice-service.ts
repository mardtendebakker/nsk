import { CreateAServiceDto } from './dto/create-aservice.dto';
import { AServiceDiscrimination } from './enum/aservice-discrimination.enum';
import { AServiceStatus } from './enum/aservice-status.enum';

export class AServiceService {
  constructor(protected readonly type: AServiceDiscrimination) {}

  getCreateInput(description: string): CreateAServiceDto {
    const replacement: CreateAServiceDto = {
      discr: this.type,
      status: AServiceStatus.STATUS_TODO,
      description: description,
    };

    return replacement;
  }
}
