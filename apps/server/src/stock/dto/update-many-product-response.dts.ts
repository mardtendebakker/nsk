import { ApiResponseProperty } from '@nestjs/swagger';

export class UpdateManyResponseProductDto {
  @ApiResponseProperty()
    count: number;
}
