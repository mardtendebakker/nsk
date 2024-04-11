import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { AServiceDiscrimination } from '../enum/aservice-discrimination.enum';
import { AServiceStatus } from '../enum/aservice-status.enum';

export class PrismaUncheckedCreateAServiceInputDto implements Prisma.aserviceUncheckedCreateInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    id?: number;

  @ApiProperty({
    enum: AServiceStatus,
    enumName: 'AServiceStatus',
    default: AServiceStatus.STATUS_TODO,
  })
  @IsEnum(AServiceStatus)
  @Type(() => Number)
    status: AServiceStatus;

  @ApiProperty({
    enum: AServiceDiscrimination,
    enumName: 'AServiceDiscrimination',
  })
  @IsEnum(AServiceDiscrimination)
  @Type(() => String)
    discr: AServiceDiscrimination;

  @ApiPropertyOptional()
  @Type(() => String)
    description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    relation_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    task_id?: number;
}
