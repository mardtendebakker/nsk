import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { PostCommonDto } from './PostCommon.dto';
import { CommonFormDto } from './common-form.dto';
import { NewContactDto } from './new-contact.dto';
import { formDataNumberTransform, formDataStringTransform } from '../../common/transforms/form-data.transform';

class Product {
  @ApiProperty()
  @Transform(formDataStringTransform)
  @IsString()
  @Type(() => String)
    name: string;

  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
    quantity: number;
}

class PublicSalesFormDto extends CommonFormDto {
  @ApiProperty()
  @Type(() => NewContactDto)
    customer: NewContactDto;

  @ApiProperty()
  @Type(() => Product)
    products: Product[];
}

export class PostSalesDto extends PostCommonDto {
  @ApiProperty()
  @Type(() => PublicSalesFormDto)
    'public_sales_form': PublicSalesFormDto;
}
