import { ApiProperty } from '@nestjs/swagger';
import { PostCommonDto } from './PostCommon.dto';
import { Transform, Type } from 'class-transformer';
import { CommonFormDto } from './common-form.dto';
import { NewCompanyDto } from './new-company.dto';
import { IsInt, IsString } from 'class-validator';
import { formDataNumberTransform, formDataStringTransform } from '../../common/transforms/form-date.transform';

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

class PublicOrderFormDto extends CommonFormDto {
  @ApiProperty()
  @Type(() => NewCompanyDto)
  customer: NewCompanyDto;

  @ApiProperty()
  @Type(() => Product)
  products: Product[];
}

export class PostOrderDto extends PostCommonDto {
  @ApiProperty()
  @Type(() => PublicOrderFormDto)
  'public_order_form': PublicOrderFormDto;
}
