import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class Order {
    @ApiPropertyOptional()
    status_id?: number;
}

export class UpdateManyOrderDto {
    @ApiProperty()
    @IsNumber({}, {each: true})
    ids: number[];

    @ApiProperty()
    order: Order;
}
