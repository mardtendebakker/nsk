import { ApiResponseProperty } from '@nestjs/swagger';

export class UpdateManyProductResponseDto {
  @ApiResponseProperty()
    affected: number;
}
