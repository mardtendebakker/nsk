import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from '@prisma/client';
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class FindOrderQueryDto implements Prisma.aorderFindManyArgs {
  @ApiPropertyOptional()
  select?: any;

  @ApiPropertyOptional()
  include?: any;
  
  @ApiPropertyOptional()
  where?: any;
  
  @ApiPropertyOptional()
  orderBy?: any;
  
  @ApiPropertyOptional()
  cursor?: any;
  
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  take?: number;
  
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  skip?: number;
  
  @ApiPropertyOptional()
  distinct?: any;
}
