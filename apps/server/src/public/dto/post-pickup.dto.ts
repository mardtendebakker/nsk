import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DataDestruction } from '../../calendar/pickup/types/destruction.enum';
import { formDataDateTransform, formDataNumberTransform, formDataStringTransform } from '../../common/transforms/form-date.transform';
import { NewContactDto } from './new-contact.dto';
import { CommonFormDto } from './common-form.dto';
import { PostCommonDto } from './PostCommon.dto';

class AddressDto {
  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
    address?: string;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
    address_zip?: string;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
    address_city?: string;
}

class QuantityProductTypeDto {
  // {type_id_1: '2', type_id_2: ''}
  [key: string]: string;
}

export class PickupFormDto extends CommonFormDto {
  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
    locationId: number;

  @ApiProperty()
  @Type(() => NewContactDto)
    supplier: NewContactDto;

  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
    countAddresses: number;

  @ApiProperty()
  @Type(() => AddressDto)
    addresses: AddressDto[];

  @ApiProperty()
  @Type(() => QuantityProductTypeDto)
    quantityAddresses: QuantityProductTypeDto[];

  @ApiPropertyOptional()
  @Transform(formDataDateTransform)
  @IsOptional()
  @IsString()
  @Type(() => Date)
    pickupDate: Date;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
    description?: string;

  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
    dataDestruction: DataDestruction;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
    origin?: string;

  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
    maxAddresses: number;
}

export class PostPickupDto extends PostCommonDto {
  @ApiProperty()
  @Type(() => PickupFormDto)
    'pickup_form': PickupFormDto;
}
