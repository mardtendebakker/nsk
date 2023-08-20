import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { PrismaUncheckedCreateAServiceInputDto } from './prisma-create-aservice-input.sto';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAServiceDto extends OmitType(PrismaUncheckedCreateAServiceInputDto, ['id', 'relation_id']) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  product_order_id?: number;
}
