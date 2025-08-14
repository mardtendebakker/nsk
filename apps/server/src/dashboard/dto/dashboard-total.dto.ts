import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';
import { IsMonthWithYear } from '../validators/is-month-with-year.decorator';
import { IsToMonthWithMonthAndYear } from '../validators/is-to-month-with-month-and-year.decorator';

export class DashboardTotalDto {
  @ApiProperty({ example: '2024', type: String })
  @Matches(/^\d{4}$/, { message: 'Year must be a 4-digit number' })
    year?: string;

  @ApiPropertyOptional({ example: '03', type: String })
  @IsOptional()
  @IsMonthWithYear({ message: 'Month requires a year' })
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'Month must be 01–12' })
    month?: string;

  @ApiPropertyOptional({ example: '08', type: String })
  @IsOptional()
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'toMonth must be 01–12' })
  @IsToMonthWithMonthAndYear({ message: 'toMonth requires both month and year' })
    toMonth?: string;
}
