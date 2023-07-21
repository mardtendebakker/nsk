import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger"
import { CreateCompanyDto } from "../../company/dto/create-company.dto";
import { DataDestruction } from "../../pickup/types/destruction.enum";
import { IsInt, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { formDataDateTransform, formDataNumberTransform, formDataStringTransform } from "../../common/transforms/form-date.transform";

export class NewCompanyDto extends PickType(CreateCompanyDto, ['name', 'representative', 'email', 'phone', 'street', 'zip', 'city'] as const) {
  @ApiProperty()
  @Transform(formDataStringTransform)
  @IsString()
  @Type(() => String)
  name: string;

  @ApiProperty()
  @Transform(formDataStringTransform)
  @IsString()
  @Type(() => String)
  email: string;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
  representative?: string;
  
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
  @Transform((zip) => zip.value.toUpperCase().replace(" ", ""))
  @IsString()
  @Type(() => String)
  zip: string;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
  city?: string;
}

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

export class PickupFormDto {
  @ApiProperty()
  @Type(() => NewCompanyDto)
  supplier: NewCompanyDto;

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

  @ApiProperty()
  @Transform(formDataStringTransform)
  @IsString()
  @Type(() => String)
  orderStatusName: string;

  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
  locationId: number;
  
  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
  confirmPage?: string;
  
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

export class PostPickupDto {
  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
  "g-recaptcha-response"?: string;

  @ApiProperty()
  @Type(() => PickupFormDto)
  "pickup_form": PickupFormDto;
}
