import { ApiResponseProperty } from "@nestjs/swagger";

export class UpdateManyResponseOrderDto {
    @ApiResponseProperty()
    count: number;
}
