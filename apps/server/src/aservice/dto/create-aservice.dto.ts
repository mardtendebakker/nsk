import { OmitType } from '@nestjs/swagger';
import { PrismaUncheckedCreateAServiceInputDto } from './prisma-create-aservice-input.sto';

export class CreateAServiceDto extends OmitType(PrismaUncheckedCreateAServiceInputDto, ['id']) {}
