import { ApiResponseProperty } from '@nestjs/swagger';

export class UpdateManyResponseAOrderDto {
  @ApiResponseProperty()
    count: number;
}
