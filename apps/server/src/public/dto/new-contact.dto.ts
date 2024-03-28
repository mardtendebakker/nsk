import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { formDataStringTransform } from '../../common/transforms/form-date.transform';
import { CreateContactDto } from '../../contact/dto/create-contact.dto';

export class NewContactDto extends PickType(CreateContactDto, [
  'company_name',
  'name',
  'email',
  'phone',
  'street',
  'zip',
  'city',
] as const) {
  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
    name?: string;

  @ApiProperty()
  @Transform(formDataStringTransform)
  @IsString()
  @Type(() => String)
    company_name: string;

  @ApiProperty()
  @Transform(formDataStringTransform)
  @IsString()
  @Type(() => String)
    email: string;

  @ApiProperty()
  @Transform(formDataStringTransform)
  @IsString()
  @Type(() => String)
    phone: string;

  @ApiProperty()
  @Transform(formDataStringTransform)
  @IsString()
  @Type(() => String)
    street: string;

  @ApiProperty()
  @Transform(formDataStringTransform)
  @Transform((zip) => zip.value.toUpperCase().replace(' ', ''))
  @IsString()
  @Type(() => String)
    zip: string;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
    city?: string;

  @ApiProperty()
  @IsBoolean()
    company_is_partner: boolean;

  @ApiProperty()
  @IsBoolean()
    company_is_customer: boolean;

  @ApiProperty()
  @IsBoolean()
    company_is_supplier: boolean;
}
