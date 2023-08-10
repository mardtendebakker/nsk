import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { aservice } from "@prisma/client";
import { ProcessedTask } from "./processed-task.dto";
import { ProductEntity } from "../entities/product.entity";

export class ProcessedStock extends PickType(ProductEntity, [
    "id",
    "sku",
    "name",
    "price",
    "created_at",
    "updated_at"
  ] as const) {
    @ApiProperty()
    type: string;
    
    @ApiProperty()
    retailPrice: number;
  
    @ApiProperty()
    location: string;
  
    @ApiProperty()
    purch: number;
  
    @ApiProperty()
    stock: number;
  
    @ApiProperty()
    hold: number;
    
    @ApiProperty()
    sale: number;
    
    @ApiProperty()
    sold: number;
    
    @ApiProperty()
    order_date: Date;
    
    @ApiProperty()
    order_nr: string;
    
    @ApiProperty()
    tasks: ProcessedTask[];
  
    @ApiProperty()
    splittable: boolean;
  
    @ApiPropertyOptional()
    product_order_id?: number;
  
    @ApiPropertyOptional()
    services?: aservice[];
  }
