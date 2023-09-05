import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { formDataStringTransform } from "../../common/transforms/form-date.transform";
import { CreateCompanyDto } from "../../company/dto/create-company.dto";

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
